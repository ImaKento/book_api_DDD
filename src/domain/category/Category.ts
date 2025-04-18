class Category {
    constructor (
        public readonly id: string,
        public name: string,
        public description: string | null,
        public created_at: Date,
        public updated_at: Date,
    ) {}
}

interface CategoryInput {
    name: string,
    description?: string,
}

interface CategoryUpdate {
    name?: string,
    description?: string,
}

export { Category, CategoryInput, CategoryUpdate };