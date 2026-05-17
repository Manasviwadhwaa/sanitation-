import express from 'express';
import { db } from '../db/setup.js';
import { authenticate, requirePermission, AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// 1. Audit Log Explorer (SuperAdmin/Authority only)
router.get('/audit-logs', authenticate, requirePermission('READ', 'AUDIT'), async (req, res) => {
  try {
    const { module, event_type, limit = 100 } = req.query;
    let query = `
      SELECT a.*, u.username as actor_name 
      FROM audit_logs a
      LEFT JOIN users u ON a.actor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (module) { query += " AND a.module = ?"; params.push(module); }
    if (event_type) { query += " AND a.event_type = ?"; params.push(event_type); }

    query += ` ORDER BY a.timestamp DESC LIMIT ?`;
    params.push(limit);

    const logs = db.prepare(query).all(...params);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. User & Role Management
router.get('/users', authenticate, requirePermission('READ', 'USERS'), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.username, u.name, u.ward_assignment, u.is_active, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `).all();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. System Health Monitor
router.get('/system-health', authenticate, requirePermission('SYSTEM', 'CONTROL'), async (req, res) => {
  try {
    const sensorCount = db.prepare('SELECT COUNT(*) as count FROM sensor_readings WHERE timestamp > datetime("now", "-10 minutes")').get() as any;
    const staleCount = db.prepare('SELECT COUNT(*) as count FROM sensor_readings WHERE heartbeat_status = "STALE"').get() as any;
    
    res.json({
      services: {
        api: 'OPERATIONAL',
        database: 'CONNECTED',
        mongodb: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'FALLBACK',
        realtime_socket: 'ACTIVE'
      },
      telemetry: {
        active_nodes: sensorCount.count,
        stale_nodes: staleCount.count,
        last_ingestion: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Role & Permission Matrix
router.get('/roles-matrix', authenticate, requirePermission('SYSTEM', 'CONTROL'), (req, res) => {
  try {
    const matrix = db.prepare(`
      SELECT r.name as role_name, p.module, p.action
      FROM roles r
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON p.id = rp.permission_id
    `).all();
    res.json(matrix);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
