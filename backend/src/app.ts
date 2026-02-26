import Fastify from 'fastify';
import { env } from './shared/config/env.js';
import { registerCors } from './shared/middleware/cors.middleware.js';
import { errorHandler } from './shared/middleware/error.middleware.js';
import { authRoutes } from './modules/auth/auth.controller.js';
import { transactionsRoutes } from './modules/transactions/transactions.controller.js';

export async function buildApp() {
    const app = Fastify({
        logger: env.NODE_ENV === 'production',
    });

    await registerCors(app);

    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(transactionsRoutes, { prefix: '/api/transactions' });

    app.setErrorHandler(errorHandler);

    return app;
}