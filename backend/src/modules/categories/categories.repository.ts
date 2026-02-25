import { CategoryType } from '@prisma/client';
import { prisma } from '@/shared/config/database.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.schema.js';

export async function findAllByUserId(userId: string, type?: CategoryType) {
  return prisma.category.findMany({
    where: { userId, ...(type && { type }) },
    orderBy: { name: 'asc' },
  });
}

export async function findById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function create(userId: string, data: CreateCategoryInput) {
  return prisma.category.create({
    data: {
      userId,
      name: data.name,
      type: data.type as CategoryType,
      color: data.color,
      icon: data.icon,
      isDefault: data.isDefault ?? false,
    },
  });
}

export async function update(id: string, data: UpdateCategoryInput) {
  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name != null && { name: data.name }),
      ...(data.type != null && { type: data.type as CategoryType }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
    },
  });
}

export async function remove(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}

export async function countTransactionsByCategoryId(categoryId: string): Promise<number> {
  return prisma.transaction.count({
    where: { categoryId },
  });
}
