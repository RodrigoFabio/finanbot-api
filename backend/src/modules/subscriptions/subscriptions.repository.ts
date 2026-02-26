import { prisma } from '@/shared/config/database.js';
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.schema.js';

export async function findAllByUserId(userId: string, isActive?: boolean) {
  return prisma.subscription.findMany({
    where: { userId, ...(isActive !== undefined && { isActive }) },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
    include: { transactions: true },
  });
}

export async function create(userId: string, data: CreateSubscriptionInput) {
  return prisma.subscription.create({
    data: {
      userId,
      description: data.description,
      amount: data.amount,
      billingDay: data.billingDay,
      type: data.type,
      category: data.category,
    },
  });
}

export async function update(id: string, data: UpdateSubscriptionInput) {
  return prisma.subscription.update({
    where: { id },
    data: {
      ...(data.description != null && { description: data.description }),
      ...(data.amount != null && { amount: data.amount }),
      ...(data.billingDay != null && { billingDay: data.billingDay }),
      ...(data.type != null && { type: data.type }),
      ...(data.category != null && { category: data.category }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function remove(id: string) {
  return prisma.subscription.delete({
    where: { id },
  });
}
