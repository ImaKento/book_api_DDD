import { Book, BookInput, BookUpdate } from './Book.js';

interface IBookRepository {
    findBooks(input: { title?: string, author_name?: string, category?: string, isbn?: string }): Promise<Book[] | null>
    findById(id: String): Promise<Book | null>
    create(input: BookInput): Promise<Book>
    update(id: string, input: BookUpdate): Promise<Book>
    delete(id: string): Promise<Book>
}

export { IBookRepository };