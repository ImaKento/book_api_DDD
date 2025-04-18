import { PrismaClient } from '@prisma/client';
import { Category, CategoryInput, CategoryUpdate } from '../domain/category/Category.js';
import { ICategoryRepository } from '../domain/category/ICategoryRepository.js'

export class CategoryRepository implements ICategoryRepository {
    constructor(private readonly prisma: PrismaClient) {}
     
    async findAll(): Promise<Category[] | null> {
        const records = await this.prisma.categories.findMany({
            orderBy: {
                created_at: 'desc',
            }
        });
        if (!records) return null;

        return records.map((record) => {
            return new Category(
                record.id,
                record.name,
                record.description,
                record.created_at,
                record.updated_at,
            )
        });
    }

    async findById(id: string): Promise<Category | null> {
        const record = await this.prisma.categories.findUnique({
            where: { id: id }
        });
        if (!record) return null;

        return new Category(
            record.id,
            record.name,
            record.description,
            record.created_at,
            record.updated_at,
        );
    }

    async create(input: CategoryInput): Promise<Category> {
        const { name, description } = input;
        const newCategory = await this.prisma.categories.create({
            data: {
                name: name,
                description: description ?? null,
            }
        });

        return new Category(
            newCategory.id,
            newCategory.name,
            newCategory.description,
            newCategory.created_at,
            newCategory.updated_at,
        );
    }

    async update(id: string, input: CategoryUpdate): Promise<Category> {
        const { name, description } = input;
        const updatedCategory = await this.prisma.categories.update({
            where: { id: id },
            data: {
                ...(name !== undefined ? { name: name } : {}),
                ...(description !== undefined ? { description: description } : {}),
            },
        });

        return new Category(
            updatedCategory.id,
            updatedCategory.name,
            updatedCategory.description,
            updatedCategory.created_at,
            updatedCategory.updated_at,
        );
    }

    async delete(id: string): Promise<Category> {
        const deletedCategory = await this.prisma.$transaction(async (tx) => {
            await this.prisma.books.updateMany({
                where: { category_id: id },
                data: { category_id: null },
            });

            return await tx.categories.delete({
                where: { id: id },
            });
        });

        return new Category(
            deletedCategory.id,
            deletedCategory.name,
            deletedCategory.description,
            deletedCategory.created_at,
            deletedCategory.updated_at,
        );
    }
}