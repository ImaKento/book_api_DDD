import { z } from 'zod';

const BookInputSchema = z.object({
    title: z.string(),
    isbn: z.string().optional(),
    author_name: z.string().optional(),
    category_name: z.string().optional(),
});

const BookUpdateSchema = z.object({
    title: z.string().optional(),
    isbn: z.string().optional(),
    author_name: z.string().optional(),
    category_name: z.string().optional(),
});

type BookInputValid = z.infer<typeof BookInputSchema>;
type BookUpdateValid = z.infer<typeof BookUpdateSchema>;

export { BookInputSchema, BookUpdateSchema, BookInputValid, BookUpdateValid };