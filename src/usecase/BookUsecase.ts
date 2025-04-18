import { z, ZodError } from 'zod';
import { Book, BookInput, BookUpdate } from '../domain/book/Book.js';
import { IBookUsecase } from '../domain/book/IBookUsecase.js';
import { IBookRepository } from '../domain/book/IBookRepository.js';
import { BookInputSchema, BookInputValid, BookUpdateSchema, BookUpdateValid } from '../validation/BookValidator.js';

export class BookUsecase implements IBookUsecase {
    constructor(private readonly bookRepo: IBookRepository) {}

    getBooks(input: { title?: string, isbn?: string, author_name?: string, category_name?: string }) {
        return this.bookRepo.findBooks(input);
    }

    getBookById(id: string) {
        const parsed = z.string().cuid().safeParse(id);
        if (!parsed.success) {
            throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(', ')}`);
        }
        return this.bookRepo.findById(parsed.data);
    }

    createBook(input: BookInput) {
        try {
            const validated: BookInputValid = BookInputSchema.parse(input);
            return this.bookRepo.create(validated);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    updateBook(id: string, input: BookUpdate): Promise<Book> {
        try {
            const validated_id = z.string().cuid().parse(id);
            const validated: BookUpdateValid = BookUpdateSchema.parse(input);
            return this.bookRepo.update(validated_id, validated);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    deleteBook(id: string): Promise<Book> {
        const parsed = z.string().cuid().safeParse(id);
        if (!parsed.success) {
            throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(', ')}`);
        }
        return this.bookRepo.delete(parsed.data);
    }
}