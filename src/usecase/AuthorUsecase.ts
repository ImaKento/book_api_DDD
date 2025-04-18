import { z, ZodError } from 'zod';
import { Author, AuthorInput, AuthorUpdate } from "../domain/author/Author.js";
import { IAuthorRepository } from "../domain/author/IAuthorRepository.js";
import { IAuthorUsecase } from "../domain/author/IAuthorUsecase.js";
import { AuthorInputSchema, AuthorInputValid, AuthorUpdateSchema, AuthorUpdateValid } from '../validation/AuthorValidator.js';

export class AuthorUsecase implements IAuthorUsecase {
    constructor(private readonly authorRepo: IAuthorRepository) {}

    getAuthors(): Promise<Author[] | null> {
        return this.authorRepo.findAll();
    }

    getAuthorById(id: string): Promise<Author | null> {
        const parsed = z.string().cuid().safeParse(id)
        if (!parsed.success) {
            throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(', ')}`);
        }
        return this.authorRepo.findById(parsed.data);
    }

    createAuthor(input: AuthorInput): Promise<Author> {
        try {
            const validated: AuthorInputValid = AuthorInputSchema.parse(input);
            return this.authorRepo.create(validated);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    updateAuthor(id: string, input: AuthorUpdate): Promise<Author> {
        try {
            const validated_id = z.string().cuid().parse(id);
            const validated: AuthorUpdateValid = AuthorUpdateSchema.parse(input);
            return this.authorRepo.update(validated_id, validated); 
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }
    
    deleteAuthor(id: string): Promise<Author> {
        const parsed = z.string().cuid().safeParse(id);
        if (!parsed.success) {
            throw new Error(`Validation Error: ${parsed.error.errors.map(e => e.message).join(', ')}`);
        }
        return this.authorRepo.delete(parsed.data);
    }
}