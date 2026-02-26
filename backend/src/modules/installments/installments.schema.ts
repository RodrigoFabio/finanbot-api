import { z } from 'zod';
import { ExpenseCategory } from '@/shared/types/categories.enum.js';

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

const expenseCategorySchema = z
  .number()
  .int()
  .refine((n) => (Object.values(ExpenseCategory) as number[]).includes(n), {
    message: 'Invalid expense category for installment',
  });

export const createInstallmentSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  totalInstallments: z.number().int().min(1, 'At least 1 installment'),
  startDate: dateSchema,
  category: expenseCategorySchema,
});

export type CreateInstallmentInput = z.infer<typeof createInstallmentSchema>;
