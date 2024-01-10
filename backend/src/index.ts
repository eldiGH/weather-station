import 'dotenv/config';
import { testDBConnection } from './db/prisma';
import { connectToRedis } from './db/redis';
import { server } from './server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const main = async () => {
  const dbError = await testDBConnection();

  if (dbError) {
    console.error("Can't connect to the DB");
    console.error(dbError);
    return;
  }

  await connectToRedis();

  server.listen({ port, host: '0.0.0.0' });
};

main();
