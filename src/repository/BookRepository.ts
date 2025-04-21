import { PrismaClient } from '@prisma/client';
import { BookEntity } from '../domain/entity/Book.js';
import { IBookRepository } from '../interface/book/IBookRepository.js'
import { BookInputValid, BookUpdateValid } from '../validation/BookValidator.js';
import { BookId, toAuthorId, toBookId, toCategoryId } from '../domain/valueObject/primaryId.js';
import { AuthorEntity } from '../domain/entity/Author.js';
import { createOptionalString100From, createString100From, createString50From } from '../domain/valueObject/wordCount.js';
import { CategoryEntity } from '../domain/entity/Category.js';
import { createOptionalIsbnValueObject } from '../domain/valueObject/isbn.js';

class BookRepository implements IBookRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findBooks(input: BookInputValid): Promise<BookEntity[] | null> {
        const { title, author_name, category_name, isbn } = input;
        const records = await this.prisma.books.findMany({
            where: {
                AND: [
                    title ? { title: { contains: String(title) }} : {},
                    isbn ? { isbn: String(isbn) } : {},
                    author_name 
                    ? {
                        author: {
                            name: { contains: String(author_name) }
                        },
                    } 
                    : {},
                    category_name
                    ? {
                        category: {
                            name: { contains: String(category_name) }
                        },
                    } 
                    : {},
                ],
            },
            include: {
                author: true,
                category: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        if (!records) return null;
        
        return records.map((record) => {
            return new BookEntity({
                id: toBookId(record.id),
                title: createString50From(record.title),
                isbn: createOptionalIsbnValueObject(record.isbn),
                author_id: record.author_id ? toAuthorId(record.author_id) : null,
                category_id: record.category_id ? toCategoryId(record.category_id) : null,
                created_at: record.created_at,
                updated_at: record.updated_at
            })
        });
    }

    async findById(id: BookId): Promise<BookEntity | null> {
        const record = await this.prisma.books.findUnique({
            where: { id: id }
        });
        if (!record) return null;

        return new BookEntity({
            id: toBookId(record.id),
            title: createString50From(record.title),
            isbn: createOptionalIsbnValueObject(record.isbn),
            author_id: record.author_id ? toAuthorId(record.author_id) : null,
            category_id: record.category_id ? toCategoryId(record.category_id) : null,
            created_at: record.created_at,
            updated_at: record.updated_at,
        });
    }

    async findAuthorByName(name: string | null): Promise<AuthorEntity | null> {
        if (!name) return null;
        const record = await this.prisma.authors.findFirst({ where: { name } });
        if (!record) return null;
        return new AuthorEntity({
            id: toAuthorId(record.id),
            name: createString50From(record.name),
            created_at: record.created_at,
            updated_at: record.updated_at
        });
    }

    async findCategoryByName(name: string | null): Promise<CategoryEntity | null> {
        if (!name) return null;
        const record = await this.prisma.categories.findFirst({ where: { name } });
        if (!record) return null;
        return new CategoryEntity({
            id: toCategoryId(record.id),
            name: createString50From(record.name),
            description: createOptionalString100From(record.description),
            created_at: record.created_at,
            updated_at: record.updated_at,
        });
    }

    async create(book: BookEntity): Promise<BookEntity> {
        const newRecord = await this.prisma.books.create({
            data: {
                title: book.title.ToString(),
                isbn: book.isbn.ToString() ?? null,
                author_id: book.author_id ? toAuthorId(book.author_id) : null,
                category_id: book.category_id ? toCategoryId(book.category_id) : null,
            },
            include: {
                author: true,
                category: true,
            }
        });
        
        return new BookEntity({
            id: toBookId(newRecord.id),
            title: createString50From(newRecord.title),
            isbn: createOptionalIsbnValueObject(newRecord.isbn),
            author_id: newRecord.author_id ? toAuthorId(newRecord.author_id) : null,
            category_id: newRecord.category_id ? toCategoryId(newRecord.category_id) : null,
            created_at: newRecord.created_at,
            updated_at: newRecord.updated_at,
        });
    }

    async update(id: BookId, input: BookUpdateValid): Promise<BookEntity> {
        const { title, isbn, author_name, category_name } = input;
        const author = author_name
        ? await this.prisma.authors.findFirst({
            where: { name: author_name },
        })
        : null;

        const category = category_name
        ? await this.prisma.categories.findFirst({
            where: { name: category_name },
        })
        : null;

        const updateRecord = await this.prisma.books.update({
            where: { id: id },
            data: {
                ...(title ? { title: title } : {}),
                ...(isbn !== undefined ? { isbn: isbn } : {}),
                ...(author ? { author_id: author.id } : {}),
                ...(category ? { category_id: category.id } : {}),
            },
        });

        return new BookEntity({
            id: toBookId(updateRecord.id),
            title: createString50From(updateRecord.title),
            isbn: createOptionalIsbnValueObject(updateRecord.isbn),
            author_id: updateRecord.author_id ? toAuthorId(updateRecord.author_id) : null,
            category_id: updateRecord.category_id ? toCategoryId(updateRecord.category_id) : null,
            created_at: updateRecord.created_at,
            updated_at: updateRecord.updated_at,
        });
    }

    async delete(id: BookId): Promise<BookEntity> {
        const deletedRecord = await this.prisma.books.delete({
            where: { id: id },
        });

        return new BookEntity({
            id: toBookId(deletedRecord.id),
            title: createString50From(deletedRecord.title),
            isbn: createOptionalIsbnValueObject(deletedRecord.isbn),
            author_id: deletedRecord.author_id ? toAuthorId(deletedRecord.author_id) : null,
            category_id: deletedRecord.category_id ? toCategoryId(deletedRecord.category_id) : null,
            created_at: deletedRecord.created_at,
            updated_at: deletedRecord.updated_at,
        });
    }
}

export { BookRepository };