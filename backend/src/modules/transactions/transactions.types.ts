export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: 1 | 2;
  date: string;
  notes?: string;
  category: number;
}

export interface UpdateTransactionInput {
  description?: string;
  amount?: number;
  type?: 1 | 2;
  date?: string;
  notes?: string;
  category?: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 1 | 2;
  category?: number;
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
