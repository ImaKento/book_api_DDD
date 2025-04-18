import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../db/prisma.js';
import { IAuthorController } from '../domain/author/IAuthorController.js';
import { IAuthorUsecase } from '../domain/author/IAuthorUsecase.js';
import { AuthorInput, AuthorUpdate } from '../domain/author/Author.js';

export class AuthorController implements IAuthorController {
    constructor(private readonly authorUsecase: IAuthorUsecase) {}

    async getAuthors(req: Request, res: Response): Promise<void> {
        try {
            const authors = await this.authorUsecase.getAuthors();
            if (!authors) {
                res.status(404).json({ error: 'Authors not Found' });
                return;
            }
            res.json(authors);
        } catch (error) {
            console.log('Failed to search authors: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAuthorById(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;

        try {
            const author = await this.authorUsecase.getAuthorById(targetId);
            if (!author) {
                res.status(404).json({ error: 'Author not Found' });
                return;
            }
            res.json(author);
        } catch (error) {
            console.log('Failed to search author: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createAuthor(req: Request, res: Response): Promise<void> {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        const authorInput: AuthorInput = { name: name };
        try {
            const newAuthor = await this.authorUsecase.createAuthor(authorInput);
            res.json(newAuthor);
        } catch (error) {
            console.log('Failed to create author: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateAuthor(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        const updateInput: AuthorUpdate = { name: name };
        try {
            const updatedAuthor = await this.authorUsecase.updateAuthor(targetId, updateInput);
            res.json(updatedAuthor);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find author for update: ', error);
                res.status(404).json({ error: 'Author not Found for Update' });
                return;
            }
            console.log('Failed to update author: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteAuthor(req: Request, res: Response): Promise<void> {
        const taregetId = req.params.id;

        try {
            await this.authorUsecase.deleteAuthor(taregetId);
            res.status(204).end();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find author for delete: ', error);
                res.status(404).json({ error: 'Author not Found for Delete' });
                return;
            }
            console.log('Failed to delete author: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}