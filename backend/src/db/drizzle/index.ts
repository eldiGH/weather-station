import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { isDevelopment } from '../../helpers/environment';
import pg from 'pg';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

const pool = new pg.Pool({
  connectionString: dbUrl
});
export const db = drizzle(pool, { schema, logger: isDevelopment });
