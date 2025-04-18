import { z } from 'zod';

const AuthorInputSchema = z.object({
    name: z.string(),
});

const AuthorUpdateSchema = z.object({
    name: z.string(),
});

type AuthorInputValid = z.infer<typeof AuthorInputSchema>;
type AuthorUpdateValid = z.infer<typeof AuthorUpdateSchema>;

export { AuthorInputSchema, AuthorUpdateSchema, AuthorInputValid, AuthorUpdateValid };