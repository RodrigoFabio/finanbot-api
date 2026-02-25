import type { CreateCategoryInput, UpdateCategoryInput } from './categories.schema.js';
import * as categoriesRepository from './categories.repository.js';

export async function getCategories(userId: string, type?: 'INCOME' | 'EXPENSE') {
  return categoriesRepository.findAllByUserId(userId, type);
}

export async function getCategoryById(id: string, userId: string) {
  const category = await categoriesRepository.findById(id);
  if (!category || category.userId !== userId) {
    const error = new Error('Category not found');
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
  return category;
}

export async function createCategory(userId: string, data: CreateCategoryInput) {
  return categoriesRepository.create(userId, data);
}

export async function updateCategory(id: string, userId: string, data: UpdateCategoryInput) {
  await getCategoryById(id, userId);
  return categoriesRepository.update(id, data);
}

export async function deleteCategory(id: string, userId: string) {
  await getCategoryById(id, userId);
  const count = await categoriesRepository.countTransactionsByCategoryId(id);
  if (count > 0) {
    const error = new Error('Cannot delete category with linked transactions');
    (error as Error & { statusCode?: number }).statusCode = 409;
    throw error;
  }
  return categoriesRepository.remove(id);
}
