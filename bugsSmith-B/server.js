import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from './database/index.js';
import auth from './middleware/auth.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

//Defining Backend Routes
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
        const { firstName, lastName, username, email, password } = req.body;
        
        if(!firstName || !lastName || !username || !email || !password) {
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
            `INSERT INTO users (first_name, last_name, username, email, password_hash) VALUES ($1, $2, $3, $4, $5)`,
            [firstName, lastName, username, email, passwordHash]
        );

        res.status(201).json({ message: 'User created successfully' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ error: 'All fields required' });
        }

        //Fetching Users
        const result = await pool.query(
            'SELECT id, first_name, last_name, username, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if(result.rows.length === 0){
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        //Comparing Passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch){
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        //Generating JWT
        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.json({
            message: 'Login Successful',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                email: user.email
            }
        });
    }

    catch(err){
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/profile', auth, (req, res) => {
    res.json({
        message: 'Protected route',
        user: req.user
    });
});

app.get('/analyze', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT id, first_name, last_name, username, email FROM users WHERE id = $1`,
            [userId]
        );

        res.json({
            message: 'User Dashboard data',
            user: result.rows[0]
        });
    }
    catch(err){
        console.errpr('DASHBOARD ERROR: ', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
});