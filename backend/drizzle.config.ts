import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

export default {
  schema: './src/db/drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: dbUrl
  }
} satisfies Config;
