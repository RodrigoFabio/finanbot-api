import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from './auth.schema.js';
import * as authService from './auth.service.js';
import { success } from '@/shared/utils/response.util.js';

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface RefreshBody {
  refreshToken?: string;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const result = await authService.register(body);
    return success(reply, 201, result);
  });

  app.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const result = await authService.login(body);
    return success(reply, 200, result);
  });

  app.post<{ Body: RefreshBody }>('/refresh', async (request, reply) => {
    const refreshToken =
      request.body?.refreshToken ??
      (request.cookies?.refreshToken as string | undefined);
    if (!refreshToken) {
      return reply.status(400).send({
        success: false,
        error: 'Refresh token is required',
      });
    }
    const result = await authService.refresh(refreshToken);
    return success(reply, 200, result);
  });

  app.post('/logout', async (request: FastifyRequest<{ Body: RefreshBody }>, reply: FastifyReply) => {
    const refreshToken =
      request.body?.refreshToken ??
      (request.cookies?.refreshToken as string | undefined);
    await authService.logout(refreshToken);
    return success(reply, 200, { message: 'Logged out successfully' });
  });
}
