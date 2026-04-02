require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Mount auth routes
const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'BugSSmith backend running' }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
