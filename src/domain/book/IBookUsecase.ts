import { Book, BookInput, BookUpdate } from '../../domain/book/Book.js'

interface IBookUsecase {
    getBooks(input: { title?: string, author_name?: string, category_name?: string, isbn?: string }): Promise<Book[] | null>;
    getBookById(id: string): Promise<Book | null>
    createBook(input: BookInput): Promise<Book>
    updateBook(id: string, input: BookUpdate): Promise<Book>
    deleteBook(id: string): Promise<Book>
}

export { IBookUsecase };