"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
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
        socket.on('joinUser', (email) => {
            socket.join(email);
            console.log(`Socket ${socket.id} joined user room: ${email}`);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.getIO = getIO;
