import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../config/logger.js';

export function registerLoggerMiddleware(app: FastifyInstance): void {
  app.addHook('onRequest', async (request: FastifyRequest)=>{
      (request  as any).startDate = Date.now()
  });

  app.addHook('onResponse', async (request: FastifyRequest, response: FastifyReply)=>{
      const duration = Date.now() - ((request as any).startTime || Date.now());
    
    logger.info({
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      duration: `${duration}ms`,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });
  })
}
