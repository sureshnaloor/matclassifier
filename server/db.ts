import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Check for database URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL client with your Supabase connection string
const client = postgres(process.env.DATABASE_URL);

// Create Drizzle ORM instance with our schema
export const db = drizzle(client, { schema }); 