import { z } from 'zod';

export const createReviewValidationSchema = z.object({
  body: z.object({
    rentalRequestId: z.string({ error: 'Rental request is required' }).uuid(),
    rating: z
      .number({ error: 'Rating is required' })
      .int()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5'),
    comment: z.string({ error: 'Comment is required' }).min(5),
  }),
});
