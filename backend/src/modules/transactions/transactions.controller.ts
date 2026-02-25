import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsQuerySchema,
  summaryQuerySchema,
} from './transactions.schema.js';
import * as transactionsService from './transactions.service.js';
import { success } from '@/shared/utils/response.util.js';
import { authenticate } from '../auth/auth.middleware.js';

interface ParamsId {
  id: string;
}

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authenticate);

  app.get<{ Querystring: unknown }>('/', async (request, reply) => {
    const userId = request.user!.id;
    const query = listTransactionsQuerySchema.parse(request.query);
    const result = await transactionsService.listTransactions(userId, query);
    return success(reply, 200, {
      items: result.items,
      total: result.total,
      page: query.page,
      limit: query.limit,
    });
  });

  app.get<{ Params: ParamsId }>('/summary', async (request, reply) => {
    const userId = request.user!.id;
    const query = summaryQuerySchema.parse(request.query);
    const summary = await transactionsService.getSummary(userId, query);
    return success(reply, 200, summary);
  });

  app.get<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const transaction = await transactionsService.getTransactionById(request.params.id, userId);
    return success(reply, 200, transaction);
  });

  app.post('/', async (request, reply) => {
    const userId = request.user!.id;
    const body = createTransactionSchema.parse(request.body);
    const transaction = await transactionsService.createTransaction(userId, body);
    return success(reply, 201, transaction);
  });

  app.put<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const body = updateTransactionSchema.parse(request.body);
    const transaction = await transactionsService.updateTransaction(
      request.params.id,
      userId,
      body,
    );
    return success(reply, 200, transaction);
  });

  app.delete<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    await transactionsService.deleteTransaction(request.params.id, userId);
    return success(reply, 200, { message: 'Transaction deleted' });
  });
}
