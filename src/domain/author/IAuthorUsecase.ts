import { Author, AuthorInput, AuthorUpdate } from '../../domain/author/Author.js';

interface IAuthorUsecase {
    getAuthors(): Promise<Author[] | null>
    getAuthorById(id: string): Promise<Author | null>
    createAuthor(input: AuthorInput): Promise<Author>
    updateAuthor(id: string, input: AuthorUpdate): Promise<Author>
    deleteAuthor(id: string): Promise<Author>
}

export { IAuthorUsecase };