import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connection } from './database/dbConnection.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
config({ path: './config.env' });

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/auth', authRouter);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

connection();
