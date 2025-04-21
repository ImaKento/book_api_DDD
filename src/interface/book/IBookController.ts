import { Request, Response } from 'express';

interface IBookController {
    getBooks(req: Request, res: Response): Promise<void>
    getBookById(req: Request, res: Response): Promise<void>
    createBook(req: Request, res: Response): Promise<void>
    updateBook(req: Request, res: Response): Promise<void>
    deleteBook(req: Request, res: Response): Promise<void>
}

export { IBookController }