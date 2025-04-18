import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../db/prisma.js';
import { ICategoryController } from '../domain/category/ICategoryController.js'
import { ICategoryUsecase } from '../domain/category/ICategoryUsecase.js';
import { CategoryInput, CategoryUpdate } from '../domain/category/Category.js';

export class CategoryController implements ICategoryController {
    constructor(private readonly categoryUsecase: ICategoryUsecase) {}

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.categoryUsecase.getCategories()
            if (!categories) {
                res.status(404).json({ error: 'Categories not Found' });
                return;
            }
            res.json(categories);
        } catch (error) {
            console.log('Failed to search categories: ', error);
            res.status(500).json({ error: 'Internal Server Error '});
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;

        try {
            const category = await this.categoryUsecase.getCategoryById(targetId);
            if (!category) {
                res.status(404).json({ error: 'Category not Found' });
                return;
            }
            res.json(category);
        } catch (error) {
            console.log('Failed to search category by id: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }
        
        const categoryInput: CategoryInput = { name: name, description: description };
        try {
            const newCategory = await this.categoryUsecase.createCategory(categoryInput);
            res.status(201).json(newCategory);
        } catch (error) {
            console.log('Failed to create category: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;
        const { name, description } = req.body;

        const updateInput: CategoryUpdate = { name: name, description: description };
        try {
            const updatedCategory = await this.categoryUsecase.updateCategory(targetId, updateInput);
            res.json(updatedCategory);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find category for update: ', error);
                res.status(404).json({ error: 'Category not Found for Update' });
                return;
            }
            console.log('Failed to update category: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;

        try {
            await this.categoryUsecase.deleteCategory(targetId);
            res.status(204).end();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find category for delete: ', error);
                res.status(404).json({ error: 'Category not Found for Delete' });
                return;
            }
            console.log('Failed to delete category: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}