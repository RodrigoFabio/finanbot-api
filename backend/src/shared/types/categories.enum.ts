export enum TransactionType {
  EXPENSE = 1,
  INCOME = 2,
}

export enum ExpenseCategory {
  ALIMENTACAO = 1,
  SAUDE = 2,
  COMBUSTIVEL = 3,
  FARMACIA = 4,
  TRANSPORTE = 5,
  MORADIA = 6,
  LAZER = 7,
  EDUCACAO = 8,
  ACESSORIOS = 9,
  ROUPAS = 10,
  OUTROS = 99,
}

export enum IncomeCategory {
  SALARIO_FIXO = 1,
  RENDA_EXTRA = 2,
  DIVIDENDOS = 3,
  BONUS = 4,
  OUTROS = 99,
}

export const EXPENSE_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.ALIMENTACAO]: 'Alimentação',
  [ExpenseCategory.SAUDE]: 'Saúde',
  [ExpenseCategory.COMBUSTIVEL]: 'Combustível',
  [ExpenseCategory.FARMACIA]: 'Farmácia',
  [ExpenseCategory.TRANSPORTE]: 'Transporte',
  [ExpenseCategory.MORADIA]: 'Moradia',
  [ExpenseCategory.LAZER]: 'Lazer',
  [ExpenseCategory.EDUCACAO]: 'Educação',
  [ExpenseCategory.ACESSORIOS]: 'Acessórios',
  [ExpenseCategory.ROUPAS]: 'Roupas',
  [ExpenseCategory.OUTROS]: 'Outros',
};

export const INCOME_LABELS: Record<IncomeCategory, string> = {
  [IncomeCategory.SALARIO_FIXO]: 'Salário Fixo',
  [IncomeCategory.RENDA_EXTRA]: 'Renda Extra',
  [IncomeCategory.DIVIDENDOS]: 'Dividendos',
  [IncomeCategory.BONUS]: 'Bônus',
  [IncomeCategory.OUTROS]: 'Outros',
};
