import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { db, initDB } from './db/setup.js';
import { initSensorJob } from './jobs/sensorJob.js';
import { initPredictiveJob } from './jobs/predictiveJob.js';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import facilityRoutes from './routes/facilities.js';
import maintenanceRoutes from './routes/maintenance.js';
import budgetRoutes from './routes/budget.js';
import analyticsRoutes from './routes/analytics.js';
import feedbackRoutes from './routes/feedback.js';
import { authenticate, authorize } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow any local origin for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize DB and Jobs
initDB();
initSensorJob();
initPredictiveJob();

// Root Health Check
app.get('/', (_req, res) => {
  res.json({
    name: 'SAAF – Smart Automated Attendance & Facilities Monitor',
    status: 'online',
    version: '1.3.0',
    auth_enabled: true
  });
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes); // Public
app.use('/api/feedback', feedbackRoutes); // Public

// Protected Admin Routes
app.use('/api/dashboard', authenticate, authorize(['admin']), dashboardRoutes);
app.use('/api/budget', authenticate, authorize(['admin']), budgetRoutes);
app.use('/api/analytics', authenticate, authorize(['admin']), analyticsRoutes);

// Shared/Protected Maintenance
app.use('/api/maintenance', authenticate, maintenanceRoutes);

// Static Hosting for Production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

httpServer.listen(port, () => {
  console.log(`SAAF Security Gateway running on http://localhost:${port}`);
});
