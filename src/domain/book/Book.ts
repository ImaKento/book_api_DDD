class Book {
    constructor(
        public readonly id: string,
        public title: string,
        public isbn: string | null,
        public author_id: string | null,
        public category_id: string | null,
        public created_at: Date,
        public updated_at: Date,
    ) {}
}

interface BookInput {
    title: string,
    isbn?: string,
    author_name?: string,
    category_name?: string,
}

interface BookUpdate {
    title?: string,
    isbn?: string,
    author_name?: string,
    category_name?: string,
}

export { Book, BookInput, BookUpdate };