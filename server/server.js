import './config/env.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import timingMiddleware from './middleware/timing.js';
import errorHandler from './middleware/errorMiddleware.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import uploadRoutes from './routes/upload.js';


connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  console.log('--- SOCKET DEBUG START ---');
  console.log('TOKEN:', token);

  if (!token) {
    console.log('❌ NO TOKEN RECEIVED');
    return next(new Error('No token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('✅ DECODED TOKEN:', decoded);

    socket.data.user = decoded;

    next();
  } catch (error) {
    console.log('❌ JWT ERROR:', error.message);
    next(new Error('Auth error'));
  }
});

io.on('connection', (socket) => {
  console.log(
    `✅ User connected: ${socket.id} | User: ${socket.data.user?.email}`
  );
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(timingMiddleware);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes(io));
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date()
  });
});

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});
