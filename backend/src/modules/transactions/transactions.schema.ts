import { z } from 'zod';
import { validateCategory } from '@/shared/utils/category-validator.js';

const transactionTypeSchema = z.union([z.literal(1), z.literal(2)]);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const createTransactionSchema = z
  .object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().positive('Amount must be positive'),
    type: transactionTypeSchema,
    date: dateSchema,
    notes: z.string().optional(),
    category: z.number().int(),
  })
  .refine((data) => validateCategory(data.type, data.category), {
    message: 'Category does not match transaction type (use expense categories for type 1, income for type 2)',
    path: ['category'],
  });

export const updateTransactionSchema = z
  .object({
    description: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    type: transactionTypeSchema.optional(),
    date: dateSchema.optional(),
    notes: z.string().optional(),
    category: z.number().int().optional(),
  })
  .refine(
    (data) => {
      if (data.type == null || data.category == null) return true;
      return validateCategory(data.type, data.category);
    },
    {
      message: 'Category does not match transaction type',
      path: ['category'],
    }
  );

export const listTransactionsQuerySchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  type: transactionTypeSchema.optional(),
  category: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const summaryQuerySchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export type SummaryQuery = z.infer<typeof summaryQuerySchema>;
