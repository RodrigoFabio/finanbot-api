export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  notes?: string;
  categoryId: string;
}

export interface UpdateTransactionInput {
  description?: string;
  amount?: number;
  type?: 'INCOME' | 'EXPENSE';
  date?: string;
  notes?: string;
  categoryId?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface SummaryFilters {
  startDate: string;
  endDate: string;
}

export interface SummaryResult {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
