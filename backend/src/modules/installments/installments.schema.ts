import { z } from 'zod';

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const createInstallmentSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  totalInstallments: z.number().int().min(1, 'At least 1 installment'),
  startDate: dateSchema,
  categoryId: z.string().uuid('Invalid category id'),
});

export type CreateInstallmentInput = z.infer<typeof createInstallmentSchema>;
