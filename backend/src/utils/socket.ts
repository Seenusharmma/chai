import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow all origins for now, restrict in production
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinAdmin', () => {
      socket.join('admin');
      console.log(`Socket ${socket.id} joined admin room`);
    });

    socket.on('joinUser', (email: string) => {
      socket.join(email);
      console.log(`Socket ${socket.id} joined user room: ${email}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
