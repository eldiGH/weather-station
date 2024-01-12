import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

const sql = postgres(dbUrl, { max: 1 });
const db = drizzle(sql);

await migrate(db, { migrationsFolder: './drizzle/migrations' });
await sql.end();
