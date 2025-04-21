import { ZodError } from 'zod';
import { AuthorEntity } from "../domain/entity/Author.js";
import { createString50From } from "../domain/valueObject/wordCount.js";
import { IAuthorRepository } from "../interface/author/IAuthorRepository.js";
import { IAuthorUsecase } from "../interface/author/IAuthorUsecase.js";
import { AuthorInputValid, AuthorUpdateValid } from '../validation/AuthorValidator.js';
import { AuthorId } from '../domain/valueObject/primaryId.js';

export class AuthorUsecase implements IAuthorUsecase {
    constructor(private readonly authorRepo: IAuthorRepository) {}

    getAuthors(): Promise<AuthorEntity[] | null> {
        return this.authorRepo.findAll();
    }

    getAuthorById(id: AuthorId): Promise<AuthorEntity | null> {
        return this.authorRepo.findById(id);
    }

    createAuthor(input: AuthorInputValid): Promise<AuthorEntity> {
        const nameVo = createString50From(input.name);
        const author = AuthorEntity.create({ name: nameVo });
        return this.authorRepo.create(author);
    }

    updateAuthor(id: AuthorId, input: AuthorUpdateValid): Promise<AuthorEntity> {
        return this.authorRepo.update(id, input);
    }
    
    deleteAuthor(id: AuthorId): Promise<AuthorEntity> {
        return this.authorRepo.delete(id);
    }
}