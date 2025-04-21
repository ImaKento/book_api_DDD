import { AuthorEntity } from "../../domain/entity/Author.js"
import { AuthorId } from "../../domain/valueObject/primaryId.js"
import { AuthorInputValid, AuthorUpdateValid } from "../../validation/AuthorValidator.js"


interface IAuthorUsecase {
    getAuthors(): Promise<AuthorEntity[] | null>
    getAuthorById(id: AuthorId): Promise<AuthorEntity | null>
    createAuthor(input: AuthorInputValid): Promise<AuthorEntity>
    updateAuthor(id: AuthorId, input: AuthorUpdateValid): Promise<AuthorEntity>
    deleteAuthor(id: AuthorId): Promise<AuthorEntity>
}

export { IAuthorUsecase };