import { z } from 'zod';

export const createRentalRequestValidationSchema = z.object({
  body: z.object({
    propertyId: z
      .string({ error: 'Property is required' })
      .uuid('Invalid property id'),
    moveInDate: z.string({ error: 'Move-in date is required' }).datetime({
      message: 'Move-in date must be a valid ISO date string',
    }),
    message: z.string().optional(),
  }),
});

export const updateRentalStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'COMPLETED'], {
      error: 'Status must be APPROVED, REJECTED, or COMPLETED',
    }),
  }),
});
