import express from 'express';
import { db } from '../db/setup.js';
import { getFacilityHealthSummary, getGlobalKPIs } from '../services/analyticsService.js';

const router = express.Router();

// 1. Global Overview KPI
router.get('/overview', async (req, res) => {
  try {
    const kpis = await getGlobalKPIs();
    res.json(kpis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Real-time Alerts Stream (Simulated for high-fidelity UI)
router.get('/alerts-stream', async (req, res) => {
  try {
    const alerts = [
      { id: 1, type: 'CRITICAL', message: 'Methane surge detected at Node-042', timestamp: new Date().toISOString() },
      { id: 2, type: 'INFO', message: 'Autonomous Drone-07 deployed for Corridor Alpha', timestamp: new Date(Date.now() - 300000).toISOString() },
      { id: 3, type: 'WARNING', message: 'Verification delta exceeded at Unit-12', timestamp: new Date(Date.now() - 600000).toISOString() }
    ];
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Rich Facility Cards with Source Transparency
router.get('/facility-cards', async (req, res) => {
  try {
    const facilities = db.prepare('SELECT * FROM facilities').all() as any[];

    const cards = await Promise.all(facilities.map(async (f) => {
      const summary = await getFacilityHealthSummary(f.id);
      
      // Fetch the absolute latest cleanliness status with source context
      const status = db.prepare(`
        SELECT status, reason, source_type, is_verified, updated_at 
        FROM cleanliness_status 
        WHERE facility_id = ? 
        ORDER BY id DESC LIMIT 1
      `).get(f.id) as any;

      // Check for heartbeat staleness (more than 10 mins)
      const lastReading = db.prepare(`
        SELECT timestamp FROM sensor_readings 
        WHERE facility_id = ? 
        ORDER BY id DESC LIMIT 1
      `).get(f.id) as any;

      const isStale = lastReading ? (new Date().getTime() - new Date(lastReading.timestamp).getTime() > 600000) : true;

      return {
        id: f.id,
        name: f.name,
        location: f.location,
        lat: f.lat,
        lng: f.lng,
        current_status: status?.status || 'GREEN',
        source_type: status?.source_type || 'SYSTEM',
        is_verified: !!status?.is_verified,
        last_verified_at: status?.updated_at,
        is_stale: isStale,
        occupancy: Math.round(summary.occupancy_rate * 20), 
        health: {
          odor: Math.round(summary.ammonia_avg || 5),
          humidity: 45,
          score: summary.cleanliness_score
        },
        ai_insight: status?.status === 'RED' ? "Critical Load Detected. Verification Pending." : "Optimal Sanitation Grid Performance.",
      };
    }));
    res.json(cards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
