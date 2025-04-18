import { Request, Response } from 'express';
import { IBookUsecase } from '../domain/book/IBookUsecase.js';
import { IBookController } from '../domain/book/IBookController.js'
import { PrismaClientKnownRequestError } from '../db/prisma.js';

export class BookController implements IBookController {
    constructor(private readonly bookUsecase: IBookUsecase) {}

    async getBooks(req: Request, res: Response): Promise<void> {
        const { title, author_name, category_name, isbn } = req.query;
        
        try {
            const books = await this.bookUsecase.getBooks({ 
                title: title as string, 
                author_name: author_name as string,
                category_name: category_name as string,
                isbn: isbn as string,
            });
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
        const targetId = req.params.id;

        try {
            const book = await this.bookUsecase.getBookById(targetId);
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
        const { title, isbn, author_name, category_name } = req.body;
        const bookInput = { title: title, isbn: isbn, author_name: author_name, category_name: category_name }
        
        if (!bookInput.title) {
            res.status(400).json({ error: 'title is required' });
            return;
        }

        try {
            const newBook = await this.bookUsecase.createBook(bookInput)
            res.status(201).json(newBook);
        } catch (error) {
            console.log('Failed to create book: ', error);
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    async updateBook(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;
        const { title, isbn, author_name, category_name } = req.body;
        const bookUpdate = { title: title, isbn: isbn, author_name: author_name, category_name: category_name };

        try {
            const updatedBook = await this.bookUsecase.updateBook(targetId, bookUpdate);
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
        const targetId = req.params.id;

        try {
            await this.bookUsecase.deleteBook(targetId);
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