import type { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.schema.js';
import * as subscriptionsRepository from './subscriptions.repository.js';
import { validateCategory } from '@/shared/utils/category-validator.js';

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
  if (!validateCategory(data.type, data.category)) {
    const error = new Error('Invalid category for subscription type');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }
  return subscriptionsRepository.create(userId, data);
}

export async function updateSubscription(id: string, userId: string, data: UpdateSubscriptionInput) {
  await getSubscriptionById(id, userId);
  if (data.type != null && data.category != null && !validateCategory(data.type, data.category)) {
    const error = new Error('Invalid category for subscription type');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }
  return subscriptionsRepository.update(id, data);
}

export async function deleteSubscription(id: string, userId: string) {
  await getSubscriptionById(id, userId);
  return subscriptionsRepository.remove(id);
}
