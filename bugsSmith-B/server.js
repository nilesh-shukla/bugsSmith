import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcrypt';
import pool from './database/index.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'Database connected',
            time: result.rows[0].now,
        });
    } catch (err) {
        console.error('QUERY ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required'});
        }

        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if(existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)`,
            [name, email, passwordHash]
        );

        res.status(201).json({ message: 'User created successfully' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
});
