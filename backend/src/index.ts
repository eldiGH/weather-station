import 'dotenv/config';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { testDBConnection } from './db/prisma';
import { connectToRedis } from './db/redis';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { appRouter } from './trpc/routers/app';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const main = async () => {
  const dbError = await testDBConnection();

  if (dbError) {
    console.error("Can't connect to the DB");
    console.error(dbError);
    return;
  }

  await connectToRedis();

  const app = createHTTPServer({
    router: appRouter,
    middleware: corsMiddleware
  });

  app.server.on('listening', () => {
    console.log(`Server listening on port ${port}`);
  });

  app.listen(port);
};

main();
