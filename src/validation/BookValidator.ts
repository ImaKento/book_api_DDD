import { z } from 'zod';

const BookIdSchema = z.string().cuid({ message: 'Invalid ID format' });

const BookInputSchema = z.object({
    title: z.string().max(50, 'title must be at most 50 characters').optional(),
    isbn: z.string().optional(),
    author_name: z.string().optional(),
    category_name: z.string().optional(),
});

const BookCreateSchema = z.object({
    title: z.string().min(1, 'title is required').max(50, 'title must be at most 50 characters'),
    isbn: z.string().optional(),
    author_name: z.string().optional(),
    category_name: z.string().optional(),
});

const BookUpdateSchema = z.object({
    title: z.string().max(50, 'title must be at most 50 characters').optional(),
    isbn: z.string().optional(),
    author_name: z.string().optional(),
    category_name: z.string().optional(),
});


type BookIdValid = z.infer<typeof BookIdSchema>;
type BookCreateValid = z.infer<typeof BookCreateSchema>;
type BookInputValid = z.infer<typeof BookInputSchema>;
type BookUpdateValid = z.infer<typeof BookUpdateSchema>;

export { BookIdSchema, BookInputSchema, BookCreateSchema, BookUpdateSchema, BookIdValid, BookInputValid, BookCreateValid, BookUpdateValid };
