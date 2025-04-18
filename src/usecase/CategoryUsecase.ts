import { z, ZodError } from 'zod';
import { Category, CategoryInput, CategoryUpdate } from '../domain/category/Category.js';
import { ICategoryUsecase } from '../domain/category/ICategoryUsecase.js';
import { ICategoryRepository } from '../domain/category/ICategoryRepository.js';
import { CategoryInputSchema, CategoryInputValid, CategoryUpdateSchema, CategoryUpdateValid } from '../validation/CategoryValidator.js';

export class CategoryUsecase implements ICategoryUsecase {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    getCategories(): Promise<Category[] | null> {
        return this.categoryRepo.findAll();
    }

    getCategoryById(id: string): Promise<Category | null> {
        const parsed = z.string().cuid().safeParse(id);
        if (!parsed.success) {
            throw new Error(parsed.error.errors.map(e => e.message).join(', '));
        }
        return this.categoryRepo.findById(parsed.data);
    }

    createCategory(input: CategoryInput): Promise<Category> {
        try {
            const validated: CategoryInputValid =  CategoryInputSchema.parse(input);
            return this.categoryRepo.create(validated);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    updateCategory(id: string, input: CategoryUpdate): Promise<Category> {
        try {
            const validated_id = z.string().cuid().parse(id);
            const validated: CategoryUpdateValid = CategoryUpdateSchema.parse(input);
            return this.categoryRepo.update(validated_id, validated);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    deleteCategory(id: string): Promise<Category> {
        const parsed = z.string().cuid().safeParse(id);
        if (!parsed.success) {
            throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(', ')}`);
        }
        return this.categoryRepo.delete(parsed.data);
    }
}