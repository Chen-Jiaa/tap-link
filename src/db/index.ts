import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env.local' }); // or .env.local

const dataBaseUrl = process.env.DATABASE_URL

if (!dataBaseUrl) {
   throw new Error('Missing Database environment variables')
}

const client = postgres(dataBaseUrl);
export const db = drizzle({ client });
