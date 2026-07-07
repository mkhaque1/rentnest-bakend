import { z } from 'zod';

export const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z.string({ error: 'Title is required' }).min(3),
    description: z.string({ error: 'Description is required' }).min(10),
    location: z.string({ error: 'Location is required' }).min(2),
    price: z.number({ error: 'Price is required' }).positive(),
    type: z.string({ error: 'Property type is required' }),
    amenities: z.array(z.string()).optional(),
    categoryId: z
      .string({ error: 'Category is required' })
      .uuid('Invalid category id'),
  }),
});

export const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    location: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    type: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
    status: z.enum(['AVAILABLE', 'UNAVAILABLE']).optional(),
  }),
});
