import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
    console.log('PostgreSQL connected successfully');
});

pool.on('error', (err) => {
    console.error('PostgreSQL error:', err);
});

export default pool;
