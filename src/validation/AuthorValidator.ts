import { z } from 'zod';

const AuthorIdSchema = z.string().cuid({ message: 'Invalid ID format' });

const AuthorInputSchema = z.object({
    name: z.string().min(1, 'name is required').max(50, 'name must be at most 50 characters'),
});

const AuthorUpdateSchema = z.object({
    name: z.string().min(1, 'name is required').max(50, 'name must be at most 50 cahracters'),
});

type AuthorIdValid = z.infer<typeof AuthorIdSchema>;
type AuthorInputValid = z.infer<typeof AuthorInputSchema>;
type AuthorUpdateValid = z.infer<typeof AuthorUpdateSchema>;

export { AuthorIdSchema, AuthorInputSchema, AuthorUpdateSchema, AuthorIdValid, AuthorInputValid, AuthorUpdateValid };