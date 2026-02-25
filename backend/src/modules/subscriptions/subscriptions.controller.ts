import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createSubscriptionSchema, updateSubscriptionSchema } from './subscriptions.schema.js';
import * as subscriptionsService from './subscriptions.service.js';
import { success } from '@/shared/utils/response.util.js';
import { authenticate } from '../auth/auth.middleware.js';

interface ListQuerystring {
  isActive?: string;
}

interface ParamsId {
  id: string;
}

export async function subscriptionsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authenticate);

  app.get<{ Querystring: ListQuerystring }>('/', async (request, reply) => {
    const userId = request.user!.id;
    const isActive =
      request.query.isActive === 'true'
        ? true
        : request.query.isActive === 'false'
          ? false
          : undefined;
    const list = await subscriptionsService.getSubscriptions(userId, isActive);
    return success(reply, 200, list);
  });

  app.get<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const subscription = await subscriptionsService.getSubscriptionById(
      request.params.id,
      userId,
    );
    return success(reply, 200, subscription);
  });

  app.post('/', async (request, reply) => {
    const userId = request.user!.id;
    const body = createSubscriptionSchema.parse(request.body);
    const subscription = await subscriptionsService.createSubscription(userId, body);
    return success(reply, 201, subscription);
  });

  app.put<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const body = updateSubscriptionSchema.parse(request.body);
    const subscription = await subscriptionsService.updateSubscription(
      request.params.id,
      userId,
      body,
    );
    return success(reply, 200, subscription);
  });

  app.delete<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    await subscriptionsService.deleteSubscription(request.params.id, userId);
    return success(reply, 200, { message: 'Subscription deleted' });
  });
}
