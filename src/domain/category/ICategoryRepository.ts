import { Category, CategoryInput, CategoryUpdate } from './Category.js';

interface ICategoryRepository {
    findAll(): Promise<Category[] | null>
    findById(id: string): Promise<Category | null>
    create(input: CategoryInput): Promise<Category>
    update(id: string, input: CategoryUpdate): Promise<Category>
    delete(id: string): Promise<Category>
}

export { ICategoryRepository };