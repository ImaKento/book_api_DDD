import { PrismaClient } from '@prisma/client';
import { IAuthorRepository } from '../domain/author/IAuthorRepository.js';
import { Author, AuthorInput, AuthorUpdate } from '../domain/author/Author.js';

export class AuthorRepository implements IAuthorRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
    async findAll(): Promise<Author[] | null> {
        const records = await this.prisma.authors.findMany({
            orderBy: {
                name: 'asc',
            }
        });
        if (!records) return null

        return records.map((record) => {
            return new Author(
                record.id,
                record.name,
                record.created_at,
                record.updated_at,
            )
        });
    }

    async findById(id: string): Promise<Author | null> {
        const record = await this.prisma.authors.findUnique({
            where: { id: id }
        });
        if (!record) return null;
        
        return new Author(
            record.id,
            record.name,
            record.created_at,
            record.updated_at,
        );
    }

    async create(input: AuthorInput): Promise<Author> {
        const { name } = input;
        const newAuthor = await this.prisma.authors.create({
            data: { name: name }
        });

        return new Author(
            newAuthor.id,
            newAuthor.name,
            newAuthor.created_at,
            newAuthor.updated_at,
        );
    }

    async update(id: string, input: AuthorUpdate): Promise<Author> {
        const { name } = input;
        const updatedAuthor = await this.prisma.authors.update({
            where: { id: id },
            data: { name: name },
        });

        return new Author(
            updatedAuthor.id,
            updatedAuthor.name,
            updatedAuthor.created_at,
            updatedAuthor.updated_at,
        )
    }

    async delete(id: string): Promise<Author> {
        const deletedAuthor = await this.prisma.$transaction(async (tx) => {
            await this.prisma.books.updateMany({
                where: { author_id: id },
                data: { author_id: null },
            });

            return await tx.authors.delete({
                where: { id: id },
            });
        });

        return new Author(
            deletedAuthor.id,
            deletedAuthor.name,
            deletedAuthor.created_at,
            deletedAuthor.updated_at,
        )
    }
    
}