import { buildApp } from "./app";
import { env } from './shared/config/env';

async function start(){
    const app = await buildApp();

    const port = env.PORT || 3000;

    try{
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${port}`);
    }catch(err){
        app.log.error(err);
        process.exit(1);
    }
}

start();