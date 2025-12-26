import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from './database/index.js';
import auth from './middleware/auth.js';
import { sendVerificationEmail } from './utils/sendEmail.js';

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

        //Email and Username uniqueness
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        const usernameExists = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );
        if(existing.rows.length > 0) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }
        if(usernameExists.rows.length > 0) {
            return res.status(409).json({
                error: 'Username already taken'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        //Generating Email Verification Token
        const verifyToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24*60*60*1000);

        //Verified email inserted in database
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, username, email, password_hash, email_verified, email_verification_token, email_verification_expires)
            VALUES ($1, $2, $3, $4, $5, false, $6, $7)
            RETURNING id, email, username`,
            [firstName, lastName, username, email, passwordHash, verifyToken, tokenExpiry]
        );

        const user = result.rows[0];

        await sendVerificationEmail(user.email, verifyToken);

        // await pool.query(
        //     `UPDATE users 
        //     SET email_verification_token = $1,
        //     email_verification_expires = $2
        //     WHERE id = $3`, [verifyToken, tokenExpiry, user.id]
        // );

        return res.status(201),json({
            message: 'Verification email sent. Please check your inbox.'
        });

        // res.status(201).json({
        //     token,
        //     user
        // });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    const result = await pool.query(
        `UPDATE users 
        SET email_verified = true,
            email_verification_token = NULL,
            email_verification_expires = NULL
        WHERE email_verification_token = $1
        AND 
            email_verification_expires > NOW()
        RETURNING id`, [token]
    );

    if(result.rowCount === 0){
        return res.status(400).json({
            error: 'Invalid or expired token'
        });
    }

    const user = result.rows[0];

    const jwtToken = jwt.sign(
        { 
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    res.json({
        message: 'Email Verified',
        token: jwtToken
    });
});

app.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ error: 'All fields required' });
        }

        //Fetching Users
        const result = await pool.query(
            'SELECT id, first_name, last_name, username, email, password_hash, email_verified FROM users WHERE email = $1',
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

        if(!user.email_verified){
            return res.status(403).json({
                error: 'Please verify your email before logging in'
            });
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