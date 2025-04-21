import { BookEntity } from '../../domain/entity/Book.js'
import { BookId } from '../../domain/valueObject/primaryId.js';
import { BookInputValid, BookUpdateValid } from '../../validation/BookValidator.js';

interface IBookUsecase {
    getBooks(input: BookInputValid): Promise<BookEntity[] | null>;
    getBookById(id: BookId): Promise<BookEntity | null>
    createBook(input: BookInputValid): Promise<BookEntity>
    updateBook(id: BookId, input: BookUpdateValid): Promise<BookEntity>
    deleteBook(id: BookId): Promise<BookEntity>
}

export { IBookUsecase };