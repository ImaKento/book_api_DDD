import { z } from 'zod';

const CategoryInputSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
})

const CategoryUpdateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
})

type CategoryInputValid = z.infer<typeof CategoryInputSchema>;
type CategoryUpdateValid = z.infer<typeof CategoryUpdateSchema>;

export { CategoryInputSchema, CategoryUpdateSchema, CategoryInputValid, CategoryUpdateValid };