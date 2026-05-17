import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Load Env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

// Initialize App & Server
import { app, httpServer, uploadDir } from './app.js';
import { io } from './socket.js';

// Initialize DB and Jobs
import { db, initDB } from './db/setup.js';
import { connectDB } from './db/mongo.js';
import { initSensorJob } from './jobs/sensorJob.js';

// Routes
import authRoutes from './routes/auth.js';
import facilityRoutes from './routes/facilities.js';
import feedbackRoutes from './routes/feedback.js';
import photoRoutes from './routes/photos.js';
import analyticsRoutes from './routes/analytics.js';
import dashboardRoutes from './routes/dashboard.js';
import maintenanceRoutes from './routes/maintenance.js';
import inspectionRoutes from './routes/inspections.js';
import budgetRoutes from './routes/budget.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';
import devRoutes from './routes/dev.js';

const port = process.env.PORT || 4001;

// Health Check
app.get('/api/health', (_req, res) => {
  try {
    const dbStatus = db.prepare('SELECT 1').get() ? 'connected' : 'error';
    res.json({ 
      status: 'online', 
      service: 'SAAF-Gateway',
      database: dbStatus,
      mongo: mongoose.connection.readyState === 1 ? 'connected' : 'fallback',
      nvidia: !!process.env.NVIDIA_API_KEY ? 'configured' : 'missing',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Register Unified Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dev', devRoutes);

// Static Hosting for Production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
  const indexPath = path.join(clientBuildPath, 'index.html');
  
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API not found' });
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).send('Client build missing');
    }
  });
}

// Error Handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 [Error]:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Gateway Error'
  });
});

// Start Services sequentially
const startServer = async () => {
  try {
    console.log('🏗️ [System] Initializing Services...');
    
    // 1. Database
    await initDB();
    console.log('✅ [SQLite] Database Ready');

    // 2. MongoDB (Non-blocking fallback)
    connectDB().then(() => {
      console.log('✅ [MongoDB] Check Completed');
    });

    // 3. Jobs
    initSensorJob();
    console.log('🚀 [Jobs] Sensor Simulation Started');

    // 4. Listen
    httpServer.listen(port, () => {
      console.log(`🚀 SAAF Gateway running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ [System] Initialization Failed:', err);
    process.exit(1);
  }
};

startServer();

export { io }; // Re-export for compatibility with some routes if needed, but better to import from socket.js
