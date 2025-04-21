import { PrismaClient } from '@prisma/client';
import { IAuthorRepository } from '../interface/author/IAuthorRepository.js';
import { AuthorEntity } from '../domain/entity/Author.js';
import { createString50From } from '../domain/valueObject/wordCount.js';
import { AuthorId, toAuthorId } from '../domain/valueObject/primaryId.js';
import { AuthorUpdateValid } from '../validation/AuthorValidator.js';

export class AuthorRepository implements IAuthorRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
    async findAll(): Promise<AuthorEntity[] | null> {
        const records = await this.prisma.authors.findMany({
            orderBy: {
                name: 'asc',
            }
        });
        if (!records) return null

        return records.map((record) => {
            return new AuthorEntity({
                id: toAuthorId(record.id),
                name: createString50From(record.name),
                created_at: record.created_at,
                updated_at: record.updated_at,
            })
        });
    }

    async findById(id: AuthorId): Promise<AuthorEntity | null> {
        const record = await this.prisma.authors.findUnique({ where: { id: id } });
        if (!record) return null;
        
        return new AuthorEntity({
            id: toAuthorId(record.id),
            name: createString50From(record.name),
            created_at: record.created_at,
            updated_at: record.updated_at,

        });
    }

    async create(author: AuthorEntity): Promise<AuthorEntity> {
        const data = {
            id: author.id,
            name: author.name.ToString(),
            created_at: author.created_at,
            updated_at: author.updated_at,
        }
        const newAuthor = await this.prisma.authors.create({ data });

        return new AuthorEntity({
            id: toAuthorId(newAuthor.id),
            name: createString50From(newAuthor.name),
            created_at: newAuthor.created_at,
            updated_at: newAuthor.updated_at,
        });
    }

    async update(id: AuthorId, input: AuthorUpdateValid): Promise<AuthorEntity> {
        const { name } = input;
        const updatedAuthor = await this.prisma.authors.update({
            where: { id: id },
            data: { name: name },
        });

        return new AuthorEntity({
            id: toAuthorId(updatedAuthor.id),
            name: createString50From(updatedAuthor.name),
            created_at: updatedAuthor.created_at,
            updated_at: updatedAuthor.updated_at,
        })
    }

    async delete(id: AuthorId): Promise<AuthorEntity> {
        const deletedAuthor = await this.prisma.$transaction(async (tx) => {
            await this.prisma.books.updateMany({
                where: { author_id: id },
                data: { author_id: null },
            });

            return await tx.authors.delete({
                where: { id: id },
            });
        });

        return new AuthorEntity({
            id: toAuthorId(deletedAuthor.id),
            name: createString50From(deletedAuthor.name),
            created_at: deletedAuthor.created_at,
            updated_at: deletedAuthor.updated_at,
        })
    }
    
}