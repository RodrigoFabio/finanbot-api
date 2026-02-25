import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../config/logger.js';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (error instanceof ZodError) {
    const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    await reply.status(400).send({
      success: false,
      error: 'Validation error',
      details: message,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      await reply.status(409).send({
        success: false,
        error: 'Conflict',
        details: 'A record with this value already exists.',
      });
      return;
    }
    if (error.code === 'P2025') {
      await reply.status(404).send({
        success: false,
        error: 'Not found',
        details: 'Record not found.',
      });
      return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    await reply.status(400).send({
      success: false,
      error: 'Validation error',
      details: 'Invalid data provided.',
    });
    return;
  }

  const statusCode = error.statusCode ?? 500;
  logger.error({ err: error, reqId: request.id }, error.message);

  await reply.status(statusCode).send({
    success: false,
    error: statusCode >= 500 ? 'Internal server error' : error.message ?? 'Error',
    ...(process.env.NODE_ENV === 'development' && { details: error.stack }),
  });
}
