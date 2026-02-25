import { z } from 'zod';

export const categoryTypeEnum = z.enum(['INCOME', 'EXPENSE']);

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: categoryTypeEnum,
  color: z.string().optional(),
  icon: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  type: categoryTypeEnum.optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
