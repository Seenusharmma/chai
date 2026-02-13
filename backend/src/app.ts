import express from 'express';
import cors from 'cors';
import path from 'path';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import orderRoutes from './routes/orderRoutes';
import menuRoutes from './routes/menuRoutes';

import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors({
  origin: ['https://chaikatti.vercel.app', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
