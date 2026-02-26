import {
  ExpenseCategory,
  EXPENSE_LABELS,
  IncomeCategory,
  INCOME_LABELS,
  TransactionType,
} from '../types/categories.enum.js';

const EXPENSE_VALUES = Object.values(ExpenseCategory).filter((v) => typeof v === 'number') as number[];
const INCOME_VALUES = Object.values(IncomeCategory).filter((v) => typeof v === 'number') as number[];

export function validateCategory(type: number, category: number): boolean {
  if (type === TransactionType.EXPENSE) {
    return EXPENSE_VALUES.includes(category);
  }
  if (type === TransactionType.INCOME) {
    return INCOME_VALUES.includes(category);
  }
  return false;
}

export function getCategoryLabel(type: number, category: number): string {
  if (type === TransactionType.EXPENSE && category in EXPENSE_LABELS) {
    return EXPENSE_LABELS[category as ExpenseCategory];
  }
  if (type === TransactionType.INCOME && category in INCOME_LABELS) {
    return INCOME_LABELS[category as IncomeCategory];
  }
  return 'Outros';
}
