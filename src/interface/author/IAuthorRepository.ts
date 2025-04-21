import { AuthorEntity } from '../../domain/entity/Author.js';
import { AuthorId } from '../../domain/valueObject/primaryId.js';
import { AuthorUpdateValid } from '../../validation/AuthorValidator.js';

interface IAuthorRepository {
    findAll(): Promise<AuthorEntity[] | null>
    findById(id: AuthorId): Promise<AuthorEntity | null>
    create(author: AuthorEntity): Promise<AuthorEntity>
    update(id: AuthorId, input: AuthorUpdateValid): Promise<AuthorEntity>
    delete(id: AuthorId): Promise<AuthorEntity>
}

export { IAuthorRepository };