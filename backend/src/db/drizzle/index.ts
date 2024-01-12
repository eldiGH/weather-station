import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { isDevelopment } from '../../helpers/environment';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

const queryClient = postgres(dbUrl);
export const db = drizzle(queryClient, { schema, logger: isDevelopment });

export * from './schema';
