import { z } from 'zod';

export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string({ error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['TENANT', 'LANDLORD'], {
      error: 'Role must be either TENANT or LANDLORD',
    }),
    phone: z.string().optional(),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ error: 'Password is required' })
      .min(6, 'Password is required'),
  }),
});
