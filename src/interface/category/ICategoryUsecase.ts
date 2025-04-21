import { CategoryEntity } from "../../domain/entity/Category.js"
import { CategoryId } from "../../domain/valueObject/primaryId.js"
import { CategoryInputValid, CategoryUpdateValid } from "../../validation/CategoryValidator.js"

interface ICategoryUsecase {
    getCategories(): Promise<CategoryEntity[] | null>
    getCategoryById(id: CategoryId): Promise<CategoryEntity | null>
    createCategory(input: CategoryInputValid): Promise<CategoryEntity>
    updateCategory(id: CategoryId, input: CategoryUpdateValid): Promise<CategoryEntity>
    deleteCategory(id: CategoryId): Promise<CategoryEntity>
}

export { ICategoryUsecase };