import { PrismaClient } from '@prisma/client';
import { Book } from '../domain/book/Book.js';
import { IBookRepository } from '../domain/book/IBookRepository.js'
import { BookInputValid, BookUpdateValid } from '../validation/BookValidator.js';

class BookRepository implements IBookRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findBooks(input: { title?: string, author_name?: string, category_name?: string, isbn?: string }): Promise<Book[] | null> {
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
            return new Book(
                record.id,
                record.title,
                record.isbn,
                record.author_id,
                record.category_id,
                record.created_at,
                record.updated_at
            )
        });
    }

    async findById(id: string): Promise<Book | null> {
        const record = await this.prisma.books.findUnique({
            where: { id: id }
        });
        if (!record) return null;

        return new Book(
            record.id,
            record.title,
            record.isbn,
            record.author_id,
            record.category_id,
            record.created_at,
            record.updated_at,
        );
    }

    async create(input: BookInputValid): Promise<Book> {
        const { title, author_name, category_name, isbn } = input;
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

        const newRecord = await this.prisma.books.create({
            data: {
                title: title,
                isbn: isbn ?? null,
                author_id: author?.id,
                category_id: category?.id,
            },
            include: {
                author: true,
                category: true,
            }
        });
        
        return new Book(
            newRecord.id,
            newRecord.title,
            newRecord.isbn,
            newRecord.author_id,
            newRecord.category_id,
            newRecord.created_at,
            newRecord.updated_at,
        );
    }

    async update(id: string, input: BookUpdateValid): Promise<Book> {
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

        return new Book(
            updateRecord.id,
            updateRecord.title,
            updateRecord.isbn,
            updateRecord.author_id,
            updateRecord.category_id,
            updateRecord.created_at,
            updateRecord.updated_at,
        );
    }

    async delete(id: string): Promise<Book> {
        const deletedRecord = await this.prisma.books.delete({
            where: { id: id },
        });

        return new Book(
            deletedRecord.id,
            deletedRecord.title,
            deletedRecord.isbn,
            deletedRecord.author_id,
            deletedRecord.category_id,
            deletedRecord.created_at,
            deletedRecord.updated_at,
        )
    }
}

export { BookRepository };