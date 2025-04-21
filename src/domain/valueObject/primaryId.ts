import cuid from 'cuid';

type Brand<K, T> = T & { __brand: K};

export type AuthorId = Brand<'AuthorId', string>;
export type BookId = Brand<'BookId', string>;
export type CategoryId = Brand<'CategoryId',string>;

export function createAuthorId(): AuthorId {
    return cuid() as AuthorId;
}

export function createBookId(): BookId {
    return cuid() as BookId;
}

export function createCategoryId(): CategoryId {
    return cuid() as CategoryId;
}

export function toAuthorId(id: string): AuthorId {
    if (!id.startsWith('c')) {
      throw new Error('Invalid cuid for AuthorId');
    }
    return id as AuthorId;
}

export function toBookId(id: string): BookId {
    if (!id.startsWith('c')) {
      throw new Error('Invalid cuid for BookId');
    }
    return id as BookId;
}

export function toCategoryId(id: string): CategoryId {
    if (!id.startsWith('c')) {
      throw new Error('Invalid cuid for CategoryId');
    }
    return id as CategoryId;
}