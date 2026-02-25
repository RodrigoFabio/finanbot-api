import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '@/shared/utils/token.util.js';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    await reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      details: 'Missing or invalid Authorization header',
    });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    request.user = { id: payload.sub, email: payload.email };
  } catch {
    await reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      details: 'Invalid or expired token',
    });
  }
}
