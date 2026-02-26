import { prisma } from '@/shared/config/database.js';
import type { CreateInstallmentInput } from './installments.schema.js';

export async function findAllByUserId(userId: string) {
  return prisma.installment.findMany({
    where: { userId },
    include: { transactions: true },
    orderBy: { startDate: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.installment.findUnique({
    where: { id },
    include: { transactions: true },
  });
}

export async function create(userId: string, data: CreateInstallmentInput) {
  return prisma.installment.create({
    data: {
      userId,
      description: data.description,
      totalAmount: data.totalAmount,
      totalInstallments: data.totalInstallments,
      startDate: new Date(data.startDate),
      category: data.category,
    },
  });
}

export async function updateStatus(
  id: string,
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
) {
  return prisma.installment.update({
    where: { id },
    data: { status },
  });
}

export async function remove(id: string) {
  return prisma.installment.delete({
    where: { id },
  });
}

export async function deleteFutureTransactions(installmentId: string, afterDate: Date) {
  return prisma.transaction.deleteMany({
    where: {
      installmentId,
      date: { gt: afterDate },
    },
  });
}

export async function getInstallmentWithTransactions(id: string) {
  return prisma.installment.findUnique({
    where: { id },
    include: { transactions: { orderBy: { date: 'asc' } } },
  });
}
