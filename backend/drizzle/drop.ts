import 'dotenv/config';
import { Client } from 'pg';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

const client = new Client({ connectionString: dbUrl });
await client.connect();

await client.query(`DROP SCHEMA public CASCADE`);
await client.query(`CREATE SCHEMA public`);
await client.query(`GRANT ALL ON SCHEMA public TO pg_database_owner`);
await client.query(`GRANT ALL ON SCHEMA public TO public`);

await client.end();
