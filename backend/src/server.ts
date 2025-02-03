import fastify from 'fastify';
import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { createContext } from './trpc';
import { appRouter, type AppRouter } from './trpc/routers/app';
import { isDevelopment } from './helpers/environment';
import { getFastifyPlugin } from 'trpc-playground/handlers/fastify';
import { renderTrpcPanel } from 'trpc-panel';

export const server = fastify({ logger: isDevelopment, maxParamLength: 5000 });

server.register(cors);

const trpcConfig = {
  prefix: '/trpc',
  useWSS: true,
  trpcOptions: {
    router: appRouter,
    createContext
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
};

server.register(ws);
server.register(fastifyTRPCPlugin, trpcConfig);

if (isDevelopment) {
  server.register(
    await getFastifyPlugin({
      trpcApiEndpoint: '/trpc',
      playgroundEndpoint: '/playground',
      router: appRouter
    }),
    {
      prefix: '/playground',
      logLevel: 'silent'
    }
  );

  server.route({
    url: '/panel',
    method: 'GET',
    handler: (_, reply) => {
      reply.header('Content-Type', 'text/html');
      reply.send(renderTrpcPanel(appRouter, { url: '/trpc' }));
    }
  });
}

server.register(fastifyTRPCPlugin, { ...trpcConfig, prefix: '/:urlParam/trpc' });
