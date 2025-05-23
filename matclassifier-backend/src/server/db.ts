import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import fs from 'fs';
import path from 'path';

// Check for database URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Read the SSL certificate
const sslCert = fs.readFileSync(path.join(process.cwd(), 'rds-ca-2019-root.pem')).toString();

// Create PostgreSQL client with SSL configuration
const client = postgres(process.env.DATABASE_URL, {
  ssl: {
    ca: sslCert
  },
  connection: {
    application_name: 'matclassifier_app'
  }
});

// Create Drizzle ORM instance with our schema
export const db = drizzle(client, { schema }); 