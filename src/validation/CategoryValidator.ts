import { z } from 'zod';

const CategoryIdSchema = z.string().cuid({ message: 'Invalid ID format' });

const CategoryInputSchema = z.object({
    name: z.string().min(1, 'name is required').max(50, 'name must be at most 50 characters'),
    description: z.string().max(100, 'description must be at most 100 characters').optional(),
})

const CategoryUpdateSchema = z.object({
    name: z.string().max(50, 'name must be at most 50 characters').optional(),
    description: z.string().max(100, 'description must be at most 100 characters').optional(),
})

type CategoryIdValid = z.infer<typeof CategoryIdSchema>;
type CategoryInputValid = z.infer<typeof CategoryInputSchema>;
type CategoryUpdateValid = z.infer<typeof CategoryUpdateSchema>;

export { CategoryIdSchema, CategoryInputSchema, CategoryUpdateSchema, CategoryIdValid, CategoryInputValid, CategoryUpdateValid };