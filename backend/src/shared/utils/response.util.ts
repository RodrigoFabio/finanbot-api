import { FastifyReply } from 'fastify';

export function success<T>(reply: FastifyReply, statusCode: number, data: T): Promise<FastifyReply> {
  return reply.status(statusCode).send({
    success: true,
    data,
  });
}

export function error(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  details?: unknown,
): Promise<FastifyReply> {
  return reply.status(statusCode).send({
    success: false,
    error: message,
    ...(details != null && { details }),
  });
}
