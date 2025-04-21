import { Request, Response } from 'express';

interface IAuthorController {
    getAuthors(req: Request, res: Response): Promise<void>
    getAuthorById(req: Request, res: Response): Promise<void>
    createAuthor(req: Request, res: Response): Promise<void>
    updateAuthor(req: Request, res: Response): Promise<void>
    deleteAuthor(req: Request, res: Response): Promise<void>
}

export { IAuthorController };