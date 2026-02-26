import type { CreateTransactionInput, UpdateTransactionInput, SummaryResult } from './transactions.types.js';
import type { ListTransactionsQuery, SummaryQuery } from './transactions.schema.js';
import * as transactionsRepository from './transactions.repository.js';
import { validateCategory } from '@/shared/utils/category-validator.js';

export async function listTransactions(userId: string, query: ListTransactionsQuery) {
  const { page = 1, limit = 20, ...rest } = query;
  return transactionsRepository.findAllByUserId(userId, { ...rest, page, limit });
}

export async function getTransactionById(id: string, userId: string) {
  const transaction = await transactionsRepository.findById(id);
  if (!transaction || transaction.userId !== userId) {
    const error = new Error('Transaction not found');
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
  return transaction;
}

export async function createTransaction(
  userId: string,
  data: CreateTransactionInput,
  installmentId?: string,
  subscriptionId?: string,
) {
  if (!validateCategory(data.type, data.category)) {
    const error = new Error('Invalid category for transaction type');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }
  return transactionsRepository.create(userId, data, installmentId, subscriptionId);
}

export async function updateTransaction(id: string, userId: string, data: UpdateTransactionInput) {
  await getTransactionById(id, userId);
  if (data.type != null && data.category != null && !validateCategory(data.type, data.category)) {
    const error = new Error('Invalid category for transaction type');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }
  return transactionsRepository.update(id, data);
}

export async function deleteTransaction(id: string, userId: string) {
  await getTransactionById(id, userId);
  return transactionsRepository.remove(id);
}

export async function getSummary(userId: string, query: SummaryQuery): Promise<SummaryResult> {
  const startDate = new Date(query.startDate);
  const endDate = new Date(query.endDate);
  const { totalIncome, totalExpense } = await transactionsRepository.getSummaryByDateRange(
    userId,
    startDate,
    endDate,
  );
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}
