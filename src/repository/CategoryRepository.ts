import { PrismaClient } from '@prisma/client';
import { CategoryEntity } from '../domain/entity/Category.js';
import { ICategoryRepository } from '../interface/category/ICategoryRepository.js'
import { createString50From, createOptionalString100From } from '../domain/valueObject/wordCount.js';
import { CategoryId, toCategoryId } from '../domain/valueObject/primaryId.js';
import { CategoryUpdateValid } from '../validation/CategoryValidator.js';
import { deserializeJsonResponse } from '@prisma/client/runtime/library';

export class CategoryRepository implements ICategoryRepository {
    constructor(private readonly prisma: PrismaClient) {}
     
    async findAll(): Promise<CategoryEntity[] | null> {
        const records = await this.prisma.categories.findMany({
            orderBy: {
                created_at: 'desc',
            }
        });
        if (!records) return null;

        return records.map((record) => {
            return new CategoryEntity({
                id: toCategoryId(record.id),
                name: createString50From(record.name),
                description: createOptionalString100From(record.description),
                created_at: record.created_at,
                updated_at: record.updated_at,
            })
        });
    }

    async findById(id: string): Promise<CategoryEntity | null> {
        const record = await this.prisma.categories.findUnique({
            where: { id: id }
        });
        if (!record) return null;

        return new CategoryEntity({
            id: toCategoryId(record.id),
            name: createString50From(record.name),
            description: createOptionalString100From(record.description),
            created_at: record.created_at,
            updated_at: record.updated_at,
        });
    }

    async create(category: CategoryEntity): Promise<CategoryEntity> {
        const data = {
            id: category.id,
            name: category.name.ToString(),
            description: category.description.ToString(),
            created_at: category.created_at,
            updated_at: category.updated_at,
        }
        const newCategory = await this.prisma.categories.create({ data });

        return new CategoryEntity({
            id: toCategoryId(newCategory.id),
            name: createString50From(newCategory.name),
            description: createOptionalString100From(newCategory.description),
            created_at: newCategory.created_at,
            updated_at: newCategory.updated_at,
        });
    }

    async update(id: string, input: CategoryUpdateValid): Promise<CategoryEntity> {
        const { name, description } = input;
        const updatedCategory = await this.prisma.categories.update({
            where: { id: id },
            data: {
                ...(name !== undefined ? { name: name } : {}),
                ...(description !== undefined ? { description: description } : {}),
            },
        });

        return new CategoryEntity({
            id: toCategoryId(updatedCategory.id),
            name: createString50From(updatedCategory.name),
            description: createOptionalString100From(updatedCategory.description),
            created_at: updatedCategory.created_at,
            updated_at: updatedCategory.updated_at,
        });
    }

    async delete(id: string): Promise<CategoryEntity> {
        const deletedCategory = await this.prisma.$transaction(async (tx) => {
            await this.prisma.books.updateMany({
                where: { category_id: id },
                data: { category_id: null },
            });

            return await tx.categories.delete({
                where: { id: id },
            });
        });

        return new CategoryEntity({
            id: toCategoryId(deletedCategory.id),
            name: createString50From(deletedCategory.name),
            description: createOptionalString100From(deletedCategory.description),
            created_at: deletedCategory.created_at,
            updated_at: deletedCategory.updated_at,
        });
    }
}