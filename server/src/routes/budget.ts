import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// 1. Budget Summary & Log
router.get('/', (req, res) => {
  try {
    const { from, to, facilityId } = req.query;
    
    let query = `
      SELECT b.*, f.name as facility_name, m.issues_noted as issue
      FROM budget_log b
      JOIN maintenance_tasks m ON b.maintenance_id = m.id
      JOIN facilities f ON m.facility_id = f.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (from) { query += " AND b.logged_at >= ?"; params.push(from); }
    if (to) { query += " AND b.logged_at <= ?"; params.push(to); }
    if (facilityId) { query += " AND f.id = ?"; params.push(facilityId); }

    const logs = db.prepare(query).all(...params);

    // Aggregates for banner
    const summary = db.prepare(`
      SELECT 
        SUM(total_cost) as total_spend,
        COUNT(*) as tasks_completed,
        AVG(response_time_mins) as avg_response
      FROM budget_log
      WHERE logged_at >= datetime('now', '-30 days')
    `).get() as any;

    res.json({
      summary: {
        total_spend: summary.total_spend || 0,
        tasks_completed: summary.tasks_completed || 0,
        avg_response: Math.round(summary.avg_response || 0)
      },
      logs
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
