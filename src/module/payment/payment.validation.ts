import { z } from 'zod';

export const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalRequestId: z.string({ error: 'Rental request is required' }).uuid(),
  }),
});
