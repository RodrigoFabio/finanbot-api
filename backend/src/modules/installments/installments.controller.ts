import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createInstallmentSchema } from './installments.schema.js';
import * as installmentsService from './installments.service.js';
import { success } from '@/shared/utils/response.util.js';
import { authenticate } from '../auth/auth.middleware.js';

interface ParamsId {
  id: string;
}

export async function installmentsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authenticate);

  app.get('/', async (request, reply) => {
    const userId = request.user!.id;
    const list = await installmentsService.getInstallments(userId);
    return success(reply, 200, list);
  });

  app.get<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const installment = await installmentsService.getInstallmentById(
      request.params.id,
      userId,
    );
    return success(reply, 200, installment);
  });

  app.post('/', async (request, reply) => {
    const userId = request.user!.id;
    const body = createInstallmentSchema.parse(request.body);
    const installment = await installmentsService.createInstallment(userId, body);
    return success(reply, 201, installment);
  });

  app.delete<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    await installmentsService.deleteInstallment(request.params.id, userId);
    return success(reply, 200, { message: 'Installment deleted' });
  });

  app.post<{ Params: ParamsId }>('/:id/cancel', async (request, reply) => {
    const userId = request.user!.id;
    const installment = await installmentsService.cancelInstallment(
      request.params.id,
      userId,
    );
    return success(reply, 200, installment);
  });
}
