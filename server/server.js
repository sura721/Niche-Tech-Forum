import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.route.js';
import postRoutes from './routes/post.routes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://jsforum.vercel.app' : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api', (req, res) => { res.send('API is running...'); });

app.get('/api/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] Health check ping received.`); 
  res.status(200).json({ status: 'ok', message: 'Server is healthy.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port);