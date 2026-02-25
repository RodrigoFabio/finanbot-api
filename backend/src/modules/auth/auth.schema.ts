import { z } from 'zod';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInputSchema = z.infer<typeof registerSchema>;
export type LoginInputSchema = z.infer<typeof loginSchema>;
