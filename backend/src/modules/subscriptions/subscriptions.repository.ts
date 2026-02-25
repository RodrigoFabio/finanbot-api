import { prisma } from '@/shared/config/database.js';
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.schema.js';

export async function findAllByUserId(userId: string, isActive?: boolean) {
  return prisma.subscription.findMany({
    where: { userId, ...(isActive !== undefined && { isActive }) },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
    include: { category: true, transactions: true },
  });
}

export async function create(userId: string, data: CreateSubscriptionInput) {
  return prisma.subscription.create({
    data: {
      userId,
      description: data.description,
      amount: data.amount,
      billingDay: data.billingDay,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
}

export async function update(id: string, data: UpdateSubscriptionInput) {
  return prisma.subscription.update({
    where: { id },
    data: {
      ...(data.description != null && { description: data.description }),
      ...(data.amount != null && { amount: data.amount }),
      ...(data.billingDay != null && { billingDay: data.billingDay }),
      ...(data.categoryId != null && { categoryId: data.categoryId }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: { category: true },
  });
}

export async function remove(id: string) {
  return prisma.subscription.delete({
    where: { id },
  });
}
