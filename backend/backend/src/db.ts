import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: you can set ssl, max pool size etc. via env vars as needed.
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
