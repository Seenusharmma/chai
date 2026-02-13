import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
import { initSocket } from './utils/socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
