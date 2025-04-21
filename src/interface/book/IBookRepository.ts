import { AuthorEntity } from "../../domain/entity/Author.js"
import { BookEntity } from "../../domain/entity/Book.js"
import { CategoryEntity } from "../../domain/entity/Category.js"
import { BookId } from "../../domain/valueObject/primaryId.js"
import { BookInputValid, BookUpdateValid } from "../../validation/BookValidator.js"


interface IBookRepository {
    findBooks(input: BookInputValid): Promise<BookEntity[] | null>
    findById(id: BookId): Promise<BookEntity | null>
    findAuthorByName(name: string | null): Promise<AuthorEntity | null>
    findCategoryByName(name: string | null): Promise<CategoryEntity | null>
    create(input: BookEntity): Promise<BookEntity>
    update(id: BookId, input: BookUpdateValid): Promise<BookEntity>
    delete(id: BookId): Promise<BookEntity>
}

export { IBookRepository };