import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/config/database.js';
import type { CreateTransactionInput, UpdateTransactionInput, TransactionFilters } from './transactions.types.js';
import { TransactionType } from '@/shared/types/categories.enum.js';

export async function findAllByUserId(
  userId: string,
  filters: TransactionFilters & { page: number; limit: number },
) {
  const where: Prisma.TransactionWhereInput = { userId };
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) (where.date as Prisma.DateTimeFilter).gte = new Date(filters.startDate);
    if (filters.endDate) (where.date as Prisma.DateTimeFilter).lte = new Date(filters.endDate);
  }
  if (filters.type != null) where.type = filters.type;
  if (filters.category != null) where.category = filters.category;

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (filters.page! - 1) * filters.limit!,
      take: filters.limit!,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { items, total };
}

export async function findById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

export async function create(
  userId: string,
  data: CreateTransactionInput,
  installmentId?: string,
  subscriptionId?: string,
) {
  return prisma.transaction.create({
    data: {
      userId,
      description: data.description,
      amount: new Prisma.Decimal(data.amount),
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes,
      installmentId,
      subscriptionId,
    },
  });
}

export async function update(id: string, data: UpdateTransactionInput) {
  return prisma.transaction.update({
    where: { id },
    data: {
      ...(data.description != null && { description: data.description }),
      ...(data.amount != null && { amount: new Prisma.Decimal(data.amount) }),
      ...(data.type != null && { type: data.type }),
      ...(data.date != null && { date: new Date(data.date) }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.category != null && { category: data.category }),
    },
  });
}

export async function remove(id: string) {
  return prisma.transaction.delete({
    where: { id },
  });
}

export async function getSummaryByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<{ totalIncome: number; totalExpense: number }> {
  const result = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const totalIncome = Number(result.find((r) => r.type === TransactionType.INCOME)?._sum.amount ?? 0);
  const totalExpense = Number(result.find((r) => r.type === TransactionType.EXPENSE)?._sum.amount ?? 0);
  return { totalIncome, totalExpense };
}
