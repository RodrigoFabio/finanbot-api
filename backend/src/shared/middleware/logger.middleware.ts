import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function loggerMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const start = Date.now();
  reply.addHook('onSend', async (_, __, payload) => {
    request.log.info(
      {
        req: { method: request.method, url: request.url },
        res: { statusCode: reply.statusCode },
        responseTime: Date.now() - start,
      },
      'request completed',
    );
    return payload;
  });
}

export function registerLoggerMiddleware(app: FastifyInstance): void {
  app.addHook('onRequest', loggerMiddleware);
}
