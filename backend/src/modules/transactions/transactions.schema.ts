import { z } from 'zod';

const transactionTypeEnum = z.enum(['INCOME', 'EXPENSE']);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const createTransactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  type: transactionTypeEnum,
  date: dateSchema,
  notes: z.string().optional(),
  categoryId: z.string().uuid('Invalid category id'),
});

export const updateTransactionSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  type: transactionTypeEnum.optional(),
  date: dateSchema.optional(),
  notes: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});

export const listTransactionsQuerySchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  type: transactionTypeEnum.optional(),
  categoryId: z.string().uuid().optional(),
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
