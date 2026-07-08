import { z } from 'zod';

export const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'BANNED'], {
      error: 'Status must be ACTIVE or BANNED',
    }),
  }),
});
