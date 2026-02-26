import { prisma } from '@/shared/config/database.js';
import type { CreateInstallmentInput } from './installments.schema.js';
import * as installmentsRepository from './installments.repository.js';
import { TransactionType } from '@/shared/types/categories.enum.js';
import { validateCategory } from '@/shared/utils/category-validator.js';

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export async function getInstallments(userId: string) {
  return installmentsRepository.findAllByUserId(userId);
}

export async function getInstallmentById(id: string, userId: string) {
  const installment = await installmentsRepository.findById(id);
  if (!installment || installment.userId !== userId) {
    const error = new Error('Installment not found');
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
  return installment;
}

export async function createInstallment(userId: string, data: CreateInstallmentInput) {
  if (!validateCategory(TransactionType.EXPENSE, data.category)) {
    const error = new Error('Invalid expense category');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  const installment = await installmentsRepository.create(userId, data);
  const amountPerInstallment = Number(installment.totalAmount) / data.totalInstallments;

  const transactionsToCreate = [];
  for (let i = 0; i < data.totalInstallments; i++) {
    const installmentDate = addMonths(new Date(data.startDate), i);
    transactionsToCreate.push({
      userId,
      description: `${data.description} (${i + 1}/${data.totalInstallments})`,
      amount: amountPerInstallment,
      type: TransactionType.EXPENSE,
      category: data.category,
      date: installmentDate,
      installmentId: installment.id,
    });
  }

  await prisma.transaction.createMany({
    data: transactionsToCreate.map((t) => ({
      userId: t.userId,
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date,
      installmentId: t.installmentId,
    })),
  });

  return installmentsRepository.getInstallmentWithTransactions(installment.id) ?? installment;
}

export async function cancelInstallment(id: string, userId: string) {
  const installment = await getInstallmentById(id, userId);
  if (installment.status !== 'ACTIVE') {
    const error = new Error('Only active installments can be cancelled');
    (error as Error & { statusCode?: number }).statusCode = 409;
    throw error;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await installmentsRepository.deleteFutureTransactions(id, today);
  await installmentsRepository.updateStatus(id, 'CANCELLED');
  return installmentsRepository.getInstallmentWithTransactions(id);
}

export async function deleteInstallment(id: string, userId: string) {
  await getInstallmentById(id, userId);
  await prisma.transaction.updateMany({
    where: { installmentId: id },
    data: { installmentId: null },
  });
  return installmentsRepository.remove(id);
}
