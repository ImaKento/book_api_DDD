import { createOptionalIsbnValueObject, OptionalIsbnValueObject } from '../valueObject/isbn.js';
import { type AuthorId, type CategoryId, type BookId, toCategoryId, toAuthorId, createBookId } from '../valueObject/primaryId.js';
import {
    type String50ValueObject,
    createString50From,
} from '../valueObject/wordCount.js';

export interface BookEntityProps {
    id: BookId;
    title: String50ValueObject,
    isbn: OptionalIsbnValueObject,
    author_id: AuthorId | null,
    category_id: CategoryId | null,
    created_at: Date,
    updated_at: Date,
}

export class BookEntity implements BookEntityProps {
    private _id: BookId;
    private _title: String50ValueObject;
    private _isbn: OptionalIsbnValueObject;
    private _author_id: AuthorId | null;
    private _category_id: CategoryId | null;
    private _created_at: Date;
    private _updated_at: Date;

    constructor(props: BookEntityProps) {
        this._id = props.id;
        this._title = props.title;
        this._isbn = props.isbn;
        this._author_id = props.author_id;
        this._category_id = props.category_id;
        this._created_at = props.created_at;
        this._updated_at = props.updated_at;
    }
    get id(): BookId {
        return this._id;
    }
    get title(): String50ValueObject {
        return this._title;
    }
    get isbn(): OptionalIsbnValueObject {
        return this._isbn;
    }
    get author_id(): AuthorId | null {
        return this._author_id;
    }
    get category_id(): CategoryId | null {
        return this._category_id;
    }
    get created_at(): Date {
        return this._created_at;
    }
    get updated_at(): Date {
        return this._updated_at;
    }

    set title(title: String50ValueObject) {
        this._title = createString50From(title)
    }
    set isbn(isbn: OptionalIsbnValueObject) {
        this._isbn = createOptionalIsbnValueObject(isbn);
    }
    set author_id(id: AuthorId | null) {
        this._author_id = id ? toAuthorId(id) : null;
    }
    set category_id(id: CategoryId | null) {
        this.category_id = id ? toCategoryId(id) : null;
    }

    static create(
        props: Omit<BookEntityProps, 'id' | 'created_at' | 'updated_at'>
    ): BookEntity {
        return new BookEntity({
            id: createBookId(),
            title: props.title,
            isbn: props.isbn ?? createOptionalIsbnValueObject(null),
            author_id: props.author_id ? toAuthorId(props.author_id) : null,
            category_id: props.category_id ? toCategoryId(props.category_id) : null,
            created_at: new Date(),
            updated_at: new Date(),
        })
    }
}
