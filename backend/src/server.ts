import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import app from './app';
import connectDB from './config/db';
import { initSocket } from './utils/socket';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 5000;

console.log('========================================');
console.log('Starting server...');
console.log('Port:', PORT);
console.log('========================================');

const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    console.log('Starting server anyway (some features may not work)...');
  }

  const server = http.createServer(app);
  
  initSocket(server);
  
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('========================================');
  });

  server.on('error', (error: any) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    }
  });
};

startServer();
