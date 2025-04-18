import { Category, CategoryInput, CategoryUpdate } from '../../domain/category/Category.js';

interface ICategoryUsecase {
    getCategories(): Promise<Category[] | null>
    getCategoryById(id: string): Promise<Category | null>
    createCategory(input: CategoryInput): Promise<Category>
    updateCategory(id: string, input: CategoryUpdate): Promise<Category>
    deleteCategory(id: string): Promise<Category>
}

export { ICategoryUsecase };