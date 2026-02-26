import { z } from 'zod';
import { validateCategory } from '@/shared/utils/category-validator.js';

const transactionTypeSchema = z.union([z.literal(1), z.literal(2)]);

export const createSubscriptionSchema = z
  .object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().positive('Amount must be positive'),
    billingDay: z.number().int().min(1).max(28),
    type: transactionTypeSchema,
    category: z.number().int(),
  })
  .refine((data) => validateCategory(data.type, data.category), {
    message: 'Category does not match subscription type (use expense categories for type 1, income for type 2)',
    path: ['category'],
  });

export const updateSubscriptionSchema = z
  .object({
    description: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    billingDay: z.number().int().min(1).max(28).optional(),
    type: transactionTypeSchema.optional(),
    category: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.type == null || data.category == null) return true;
      return validateCategory(data.type, data.category);
    },
    {
      message: 'Category does not match subscription type',
      path: ['category'],
    }
  );

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
