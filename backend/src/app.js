import cors from 'cors';
import express from 'express';
import { healthRouter } from './routes/health.js';
import { studentsRouter } from './routes/students.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (request, response) => {
    response.json({
      appName: process.env.APP_NAME || 'Student Manager',
      message: 'Backend is running',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/students', studentsRouter);

  app.use((error, request, response, next) => {
    response.status(500).json({
      message: 'Internal server error',
    });
  });

  return app;
}
