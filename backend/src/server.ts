import fastify from 'fastify';
import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { createContext } from './trpc';
import { appRouter, type AppRouter } from './trpc/routers/app';
import { isDevelopment } from './helpers/environment';

export const server = fastify({ logger: isDevelopment, maxParamLength: 5000 });

server.register(cors);

server.register(ws);
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  useWSS: true,
  trpcOptions: {
    router: appRouter,
    createContext
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
});
