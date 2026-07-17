import { z } from 'zod';

// SubscriptionType: frequência da assinatura (independente de TransactionType)
// 1 = Mensal, 2 = Anual, 3 = Semanal
const subscriptionTypeSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

// SubscriptionCategory: categorias próprias de assinaturas
// 1=Streaming, 2=Música, 3=Academia, 4=Software, 5=Educação,
// 6=Notícias, 7=Saúde, 8=Jogos, 9=Serviços Contratados, 99=Outros
const subscriptionCategorySchema = z.number().int().positive();

export const createSubscriptionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  billingDay: z.number().int().min(1).max(28),
  type: subscriptionTypeSchema,
  category: subscriptionCategorySchema,
});

export const updateSubscriptionSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  billingDay: z.number().int().min(1).max(28).optional(),
  type: subscriptionTypeSchema.optional(),
  category: subscriptionCategorySchema.optional(),
  isActive: z.boolean().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
