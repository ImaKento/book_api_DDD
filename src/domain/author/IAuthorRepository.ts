import { Author, AuthorInput, AuthorUpdate } from './Author.js';

interface IAuthorRepository {
    findAll(): Promise<Author[] | null>
    findById(id: string): Promise<Author | null>
    create(input: AuthorInput): Promise<Author>
    update(id: string, input: AuthorUpdate): Promise<Author>
    delete(id: string): Promise<Author>
}

export { IAuthorRepository };