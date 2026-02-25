import { TransactionType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/config/database.js';
import type { CreateTransactionInput, UpdateTransactionInput, TransactionFilters } from './transactions.types.js';

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
  if (filters.type) where.type = filters.type as TransactionType;
  if (filters.categoryId) where.categoryId = filters.categoryId;

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
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
    include: { category: true },
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
      type: data.type as TransactionType,
      date: new Date(data.date),
      notes: data.notes,
      categoryId: data.categoryId,
      installmentId,
      subscriptionId,
    },
    include: { category: true },
  });
}

export async function update(id: string, data: UpdateTransactionInput) {
  return prisma.transaction.update({
    where: { id },
    data: {
      ...(data.description != null && { description: data.description }),
      ...(data.amount != null && { amount: new Prisma.Decimal(data.amount) }),
      ...(data.type != null && { type: data.type as TransactionType }),
      ...(data.date != null && { date: new Date(data.date) }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.categoryId != null && { categoryId: data.categoryId }),
    },
    include: { category: true },
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

  const totalIncome = Number(result.find((r) => r.type === 'INCOME')?._sum.amount ?? 0);
  const totalExpense = Number(result.find((r) => r.type === 'EXPENSE')?._sum.amount ?? 0);
  return { totalIncome, totalExpense };
}
