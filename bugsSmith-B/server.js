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
import { error } from 'console';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

        try {
            await sendVerificationEmail(user.email, verifyToken);
        } catch (emailErr) {
            console.error('EMAIL SEND ERROR:', emailErr);
            // Return partial success: user created but email failed
            return res.status(201).json({
                message: 'User created but verification email failed to send. Contact support.'
            });
        }

        return res.status(201).json({
            message: 'Verification email sent. Please check your inbox.'
        });

    }
    catch(err) {
        console.error('SIGNUP ERROR:', err);
        if (err && err.code === '23505') {
            // Postgres unique_violation
            return res.status(409).json({ error: 'Email or username already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/verify-email', async (req, res) => {
    const { token, redirect_to } = req.query;
    try {
        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        const result = await pool.query(
            `UPDATE users 
            SET email_verified = true,
                email_verification_token = NULL,
                email_verification_expires = NULL
            WHERE email_verification_token = $1
            AND 
                email_verification_expires > NOW()
            RETURNING id, email`, [token]
        );
        if(result.rowCount === 0){
            if(redirect_to) {
            return res.redirect(`${redirect_to}?status=error`);
            }
            return res.status(400).json({
                error: 'Invalid or expired token'
            })
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
        if(redirect_to) {
            return res.redirect(`${redirect_to}?status=success`);
        }

        return res.json({
            message: 'Email verified successfully',
            token: jwtToken
        });
    }
    catch (err) {
        console.error('VERIFY EMAIL ERROR:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/check-verification', async (req, res) => {
    try{
        const { email } =req.query;
        if(!email) return res.status(400).json({
            error: 'Email is required'
        });

        const result = await pool.query(
            'SELECT email_verified FROM users WHERE email = $1', [email]
        );

        if(result.rows.length ===  0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        
        return res.json({
            verified: !!result.rows[0].email_verified
        });
    }
    catch(err){
        console.error('CHECK VERIFICATION ERROR:', err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.post('/resend-verification', async (req, res) => {
    try{
        const { email } = req.body;
        if(!email) return res.status(400).json({
            error: 'Email is required'
        });

        const userRes = await pool.query(
            'SELECT id, email_verified FROM users WHERE email = $1', [email]
        );

        if(userRes.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const user = userRes.rows[0];
        if(user.email_verified) return res.status(400).json({ error: 'Email already verified' });

        const verifyToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24*60*60*1000);

        await pool.query(
            `UPDATE users
            SET email_verification_token = $1,
                email_verification_expires = $2
            WHERE id = $3`,
            [verifyToken, tokenExpiry, user.id]
        );

        try {
            await sendVerificationEmail(email, verifyToken);
            return res.json({
                message: 'Verification email sent. Please check you inbox.'
            });
        }
        catch(emailErr) {
            console.error('RESEND EMAIL ERROR:', emailErr);
            return res.status(500).json({
                error: 'Failed to send verification email'
            });
        }
    }
    catch(err) {
        console.error('RESEND VERIFICATION ERROR:', err);
        return res.status(500).json({
            error: 'Internal server error'
        });
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
        console.error('DASHBOARD ERROR: ', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});