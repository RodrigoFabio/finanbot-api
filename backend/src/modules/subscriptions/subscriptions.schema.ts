import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  billingDay: z.number().int().min(1).max(28),
  categoryId: z.string().uuid('Invalid category id'),
});

export const updateSubscriptionSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  billingDay: z.number().int().min(1).max(28).optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
