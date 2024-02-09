import 'dotenv/config';
import { connectToRedis } from './db/redis';
import { server } from './server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

await connectToRedis();

server.listen({ port, host: '0.0.0.0' });
