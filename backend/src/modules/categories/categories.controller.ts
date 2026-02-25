import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createCategorySchema, updateCategorySchema } from './categories.schema.js';
import * as categoriesService from './categories.service.js';
import { success } from '@/shared/utils/response.util.js';
import { authenticate } from '../auth/auth.middleware.js';

interface ListQuerystring {
  type?: 'INCOME' | 'EXPENSE';
}

interface ParamsId {
  id: string;
}

export async function categoriesRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authenticate);

  app.get<{ Querystring: ListQuerystring }>('/', async (request, reply) => {
    const userId = request.user!.id;
    const { type } = request.query;
    const list = await categoriesService.getCategories(userId, type);
    return success(reply, 200, list);
  });

  app.get<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const category = await categoriesService.getCategoryById(request.params.id, userId);
    return success(reply, 200, category);
  });

  app.post('/', async (request, reply) => {
    const userId = request.user!.id;
    const body = createCategorySchema.parse(request.body);
    const category = await categoriesService.createCategory(userId, body);
    return success(reply, 201, category);
  });

  app.put<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    const body = updateCategorySchema.parse(request.body);
    const category = await categoriesService.updateCategory(request.params.id, userId, body);
    return success(reply, 200, category);
  });

  app.delete<{ Params: ParamsId }>('/:id', async (request, reply) => {
    const userId = request.user!.id;
    await categoriesService.deleteCategory(request.params.id, userId);
    return success(reply, 200, { message: 'Category deleted' });
  });
}
