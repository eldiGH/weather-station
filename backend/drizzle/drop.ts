import postgres from 'postgres';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

const sql = postgres(dbUrl, { max: 1 });

await sql`DROP SCHEMA public CASCADE`;
await sql`CREATE SCHEMA public`;
await sql`GRANT ALL ON SCHEMA public TO pg_database_owner`;
await sql`GRANT ALL ON SCHEMA public TO public`;

await sql.end();
