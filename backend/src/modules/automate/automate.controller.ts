import { success } from '@/shared/utils/response.util.js';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

 interface ExpensiveAutomate {
    value :Number;
    nameStore: string;
}

export async function AutomateController(app: FastifyInstance){
    app.post<{Body: ExpensiveAutomate}>('/expensive-automate', async (req: FastifyRequest, rep: FastifyReply)=>{
        const body = req.body;
        console.log(body)

        return success;
    });
}