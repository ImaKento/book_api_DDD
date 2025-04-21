import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../db/prisma.js';
import { IBookUsecase } from '../interface/book/IBookUsecase.js';
import { IBookController } from '../interface/book/IBookController.js'
import { BookCreateSchema, BookIdSchema, BookInputSchema } from '../validation/BookValidator.js';
import { toBookId } from '../domain/valueObject/primaryId.js';

export class BookController implements IBookController {
    constructor(private readonly bookUsecase: IBookUsecase) {}

    async getBooks(req: Request, res: Response): Promise<void> {
        const parsed = BookInputSchema.safeParse(req.query);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }
        
        try {
            const books = await this.bookUsecase.getBooks(parsed.data);
            if (!books) {
                res.status(404).json({ error: 'Books not Found' });
                return;
            }
            res.json(books);
        } catch (error) {
            console.log('Failed to search books: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getBookById(req: Request, res: Response): Promise<void> {
        const parsedId = BookIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }

        try {
            const book = await this.bookUsecase.getBookById(toBookId(parsedId.data));
            if (!book) {
                res.status(404).json({ error: 'Book not Found' });
                return;
            }
            res.json(book);
        } catch (error) {
            console.log('Failed to search book by id: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createBook(req: Request, res: Response): Promise<void> {
        const parsed = BookCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }
        
        if (!parsed.data.title) {
            res.status(400).json({ error: 'title is required' });
            return;
        }

        try {
            const newBook = await this.bookUsecase.createBook(parsed.data);
            res.status(201).json(newBook);
        } catch (error) {
            console.log('Failed to create book: ', error);
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    async updateBook(req: Request, res: Response): Promise<void> {
        const parsedId = BookIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }

        const validated = BookInputSchema.safeParse(req.body);
        if (!validated.success) {
            res.status(400).json({ error: validated.error.flatten() });
            return;
        }

        try {
            const updatedBook = await this.bookUsecase.updateBook(toBookId(parsedId.data), validated.data);
            res.json(updatedBook)
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find book for update: ', error);
                res.status(404).json({ error: 'Book not Found for Update' });
                return;
            }
            console.log('Failed to update book: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async deleteBook(req: Request, res: Response): Promise<void> {
        const parsedId = BookIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }
        
        try {
            await this.bookUsecase.deleteBook(toBookId(parsedId.data));
            res.status(204).end();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find book for delete: ', error);
                res.status(404).json({ error: 'Book not Found for Delete' });
                return;
            }
            console.log('Failed to delete book: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}