import { Request, Response } from 'express';

interface ICategoryController {
    getCategories(req: Request, res: Response): Promise<void>
    getCategoryById(req: Request, res: Response): Promise<void>
    createCategory(req: Request, res: Response): Promise<void>
    updateCategory(req: Request, res: Response): Promise<void>
    deleteCategory(req: Request, res: Response): Promise<void>
}

export { ICategoryController };