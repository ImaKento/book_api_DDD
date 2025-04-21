import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../db/prisma.js';
import { ICategoryController } from '../interface/category/ICategoryController.js'
import { ICategoryUsecase } from '../interface/category/ICategoryUsecase.js';
import { CategoryIdSchema, CategoryInputSchema, CategoryUpdateSchema } from '../validation/CategoryValidator.js';
import { toCategoryId } from '../domain/valueObject/primaryId.js';

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
        const parsedId = CategoryIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }

        try {
            const category = await this.categoryUsecase.getCategoryById(toCategoryId(parsedId.data));
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
        const parsed = CategoryInputSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        try {
            const newCategory = await this.categoryUsecase.createCategory(parsed.data);
            res.status(201).json(newCategory);
        } catch (error) {
            console.log('Failed to create category: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        const parsedId = CategoryIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }
        const validated = CategoryUpdateSchema.safeParse(req.body);
        if (!validated.success) {
            res.status(400).json({ error: validated.error.flatten() });
            return;
        }

        try {
            const updatedCategory = await this.categoryUsecase.updateCategory(toCategoryId(parsedId.data), validated.data);
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
        const parsedId = CategoryIdSchema.safeParse(req.params.id);
        if (!parsedId.success) {
            res.status(400).json({ error: parsedId.error.flatten() });
            return;
        }

        try {
            await this.categoryUsecase.deleteCategory(toCategoryId(parsedId.data));
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