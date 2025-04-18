class Author {
    constructor(
        public readonly id: string,
        public name: string,
        public created_at: Date,
        public updated_at: Date,
    ) {}
}

interface AuthorInput {
    name: string,
}

interface AuthorUpdate {
    name: string,
}

export { Author, AuthorInput, AuthorUpdate }