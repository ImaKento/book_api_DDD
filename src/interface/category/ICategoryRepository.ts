import { CategoryEntity } from '../../domain/entity/Category.js';
import { CategoryId } from '../../domain/valueObject/primaryId.js';
import { CategoryInputValid, CategoryUpdateValid } from '../../validation/CategoryValidator.js';

interface ICategoryRepository {
    findAll(): Promise<CategoryEntity[] | null>
    findById(id: CategoryId): Promise<CategoryEntity | null>
    create(input: CategoryEntity): Promise<CategoryEntity>
    update(id: CategoryId, input: CategoryUpdateValid): Promise<CategoryEntity>
    delete(id: CategoryId): Promise<CategoryEntity>
}

export { ICategoryRepository };