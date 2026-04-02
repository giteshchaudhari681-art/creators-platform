import './config/env.js';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/upload.js';
import timingMiddleware from './middleware/timing.js';
import errorHandler from './middleware/errorMiddleware.js';

const configuredClientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (configuredClientOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1');
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

const app = express();
const httpServer = createServer(app);
const debugSockets = process.env.DEBUG_SOCKETS === 'true';

const io = new Server(httpServer, {
  cors: {
    ...corsOptions,
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    if (debugSockets) {
      console.log('Socket auth failed: no token received');
    }
    return next(new Error('No token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (error) {
    if (debugSockets) {
      console.log('Socket auth failed:', error.message);
    }
    next(new Error('Auth error'));
  }
});

io.on('connection', (socket) => {
  if (debugSockets) {
    console.log(`Socket connected: ${socket.id} | User: ${socket.data.user?.email}`);
  }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(timingMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes(io));
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running!',
    timestamp: new Date(),
  });
});

app.use(errorHandler);

export default app;
export { httpServer, io };
