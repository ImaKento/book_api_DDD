import { z, ZodError } from 'zod';
import { BookEntity } from '../domain/entity/Book.js';
import { IBookUsecase } from '../interface/book/IBookUsecase.js';
import { IBookRepository } from '../interface/book/IBookRepository.js';
import { BookCreateValid, BookInputSchema, BookInputValid, BookUpdateSchema, BookUpdateValid } from '../validation/BookValidator.js';
import { BookId, toAuthorId, toCategoryId } from '../domain/valueObject/primaryId.js';
import { createOptionalString100From, createString50From } from '../domain/valueObject/wordCount.js';
import { createOptionalIsbnValueObject } from '../domain/valueObject/isbn.js';

export class BookUsecase implements IBookUsecase {
    constructor(private readonly bookRepo: IBookRepository) {}

    getBooks(input: BookInputValid): Promise<BookEntity[] | null> {
        return this.bookRepo.findBooks(input);
    }

    getBookById(id: BookId): Promise<BookEntity | null> {
        return this.bookRepo.findById(id);
    }

    async createBook(input: BookCreateValid): Promise<BookEntity> {
        const titleVo = createString50From(input.title);
        const isbnVo = createOptionalIsbnValueObject(input.isbn ?? null);
        
        const author = await this.bookRepo.findAuthorByName(input.author_name ?? null);
        const category = await this.bookRepo.findCategoryByName(input.category_name ?? null);
        
        const book = BookEntity.create({
            title: titleVo,
            isbn: isbnVo,
            author_id: author ? toAuthorId(author.id) : null,
            category_id: category ? toCategoryId(category.id) : null,
        });
        return this.bookRepo.create(book);
    }

    updateBook(id: BookId, input: BookUpdateValid): Promise<BookEntity> {
        return this.bookRepo.update(id, input);
    }

    deleteBook(id: BookId): Promise<BookEntity> {
        return this.bookRepo.delete(id);
    }
}