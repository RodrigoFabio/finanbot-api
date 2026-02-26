import Fastify from 'fastify';
import { registerCors } from './shared/middleware/cors.middleware';
import { errorHandler } from './shared/middleware/error.middleware';
import { authRoutes } from './modules/auth/auth.controller';
import { transactionsRoutes } from './modules/transactions/transactions.controller';

export async function buildApp(){
    const app = Fastify({
        logger: process.env.NODE_ENV === 'production'
    });

    await registerCors(app);

    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(transactionsRoutes, { prefix: '/api/transactions' });

    app.setErrorHandler(errorHandler);

    return app;
}