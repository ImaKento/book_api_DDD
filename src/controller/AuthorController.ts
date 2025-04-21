import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../db/prisma.js';
import { IAuthorController } from '../interface/author/IAuthorController.js';
import { IAuthorUsecase } from '../interface/author/IAuthorUsecase.js';
import { AuthorIdSchema, AuthorInputSchema, AuthorUpdateSchema } from '../validation/AuthorValidator.js';
import { toAuthorId } from '../domain/valueObject/primaryId.js';

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
        const parsedId = AuthorIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }
        
        try {
            const author = await this.authorUsecase.getAuthorById(toAuthorId(parsedId.data));
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
        const parsed = AuthorInputSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        try {
            const newAuthor = await this.authorUsecase.createAuthor(parsed.data);
            res.status(201).json(newAuthor);
        } catch (error) {
            console.log('Failed to create author: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateAuthor(req: Request, res: Response): Promise<void> {
        const parsedId = AuthorIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }

        const validated = AuthorUpdateSchema.safeParse(req.body);
        if (!validated.success) {
            res.status(400).json({ error: validated.error.flatten() });
            return;
        }

        try {
            const updatedAuthor = await this.authorUsecase.updateAuthor(toAuthorId(parsedId.data), validated.data);
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
        const parsedId = AuthorIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }

        try {
            await this.authorUsecase.deleteAuthor(toAuthorId(parsedId.data));
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