import type { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.schema.js';
import * as subscriptionsRepository from './subscriptions.repository.js';
import * as categoriesRepository from '@/modules/categories/categories.repository.js';

export async function getSubscriptions(userId: string, isActive?: boolean) {
  return subscriptionsRepository.findAllByUserId(userId, isActive);
}

export async function getSubscriptionById(id: string, userId: string) {
  const subscription = await subscriptionsRepository.findById(id);
  if (!subscription || subscription.userId !== userId) {
    const error = new Error('Subscription not found');
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
  return subscription;
}

export async function createSubscription(userId: string, data: CreateSubscriptionInput) {
  const category = await categoriesRepository.findById(data.categoryId);
  if (!category || category.userId !== userId) {
    const error = new Error('Category not found');
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
  return subscriptionsRepository.create(userId, data);
}

export async function updateSubscription(id: string, userId: string, data: UpdateSubscriptionInput) {
  await getSubscriptionById(id, userId);
  if (data.categoryId) {
    const category = await categoriesRepository.findById(data.categoryId);
    if (!category || category.userId !== userId) {
      const error = new Error('Category not found');
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }
  }
  return subscriptionsRepository.update(id, data);
}

export async function deleteSubscription(id: string, userId: string) {
  await getSubscriptionById(id, userId);
  return subscriptionsRepository.remove(id);
}
