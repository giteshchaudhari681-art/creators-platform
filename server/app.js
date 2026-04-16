import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/users', userRoutes);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Server is running'
    });
  });

  return app;
};

export default createApp;
