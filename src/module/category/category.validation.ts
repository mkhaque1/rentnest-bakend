import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Category name is required' }).min(2),
  }),
});

export const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
  }),
});
