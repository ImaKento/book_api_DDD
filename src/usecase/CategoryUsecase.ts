import { ZodError } from 'zod';
import { CategoryEntity } from '../domain/entity/Category.js';
import { createString50From, createOptionalString100From } from '../domain/valueObject/wordCount.js';
import { ICategoryUsecase } from '../interface/category/ICategoryUsecase.js';
import { ICategoryRepository } from '../interface/category/ICategoryRepository.js';
import { CategoryInputValid, CategoryUpdateValid } from '../validation/CategoryValidator.js';
import { CategoryId } from '../domain/valueObject/primaryId.js';

export class CategoryUsecase implements ICategoryUsecase {
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    getCategories(): Promise<CategoryEntity[] | null> {
        return this.categoryRepo.findAll();
    }

    getCategoryById(id: CategoryId): Promise<CategoryEntity | null> {
        return this.categoryRepo.findById(id);
    }

    createCategory(input: CategoryInputValid): Promise<CategoryEntity> {
        const nameVo = createString50From(input.name);
        const descriptionVo = createOptionalString100From(input.description);
        const category = CategoryEntity.create({ name: nameVo, description: descriptionVo });
        return this.categoryRepo.create(category);
    }

    updateCategory(id: CategoryId, input: CategoryUpdateValid): Promise<CategoryEntity> {
        return this.categoryRepo.update(id, input);
    }

    deleteCategory(id: CategoryId): Promise<CategoryEntity> {
        return this.categoryRepo.delete(id);
    }
}