import express from 'express';
import { db } from '../db/setup';
import { io } from '../index';

const router = express.Router();

// 1. Create Maintenance Task
router.post('/create', (req, res) => {
  try {
    const { facility_id, issue_reason, assigned_to, severity } = req.body;
    
    const info = db.prepare(`
      INSERT INTO maintenance_tasks (facility_id, issue_reason, assigned_to, created_at, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(facility_id, issue_reason, assigned_to || 'UNASSIGNED', new Date().toISOString(), 'PENDING');

    io.emit('maintenance_alert', {
      facility_id,
      alert_type: 'MANUAL_TICKET',
      message: issue_reason,
      severity: severity || 'MEDIUM'
    });

    res.json({ id: info.lastInsertRowid, status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Accept Task (Cleaner)
router.put('/:id/accept', (req, res) => {
  try {
    const { id } = req.params;
    const { eta_minutes } = req.body;
    
    db.prepare(`
      UPDATE maintenance_tasks 
      SET accepted_at = ?, eta_minutes = ?, status = 'IN_PROGRESS'
      WHERE id = ?
    `).run(new Date().toISOString(), eta_minutes || 15, id);

    res.json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Complete Task
router.put('/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const { scan_qr_code, supplies_used, issues_noted, cost_inr } = req.body;
    
    const task = db.prepare('SELECT * FROM maintenance_tasks WHERE id = ?').get(id) as any;
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const completed_at = new Date().toISOString();
    const created_at = new Date(task.created_at);
    const response_time_mins = Math.floor((new Date(completed_at).getTime() - created_at.getTime()) / 60000);

    // Update Task
    db.prepare(`
      UPDATE maintenance_tasks 
      SET completed_at = ?, scan_qr_code = ?, supplies_used = ?, issues_noted = ?, status = 'COMPLETED'
      WHERE id = ?
    `).run(completed_at, scan_qr_code, JSON.stringify(supplies_used), issues_noted, id);

    // Log Budget
    const manpower_cost = cost_inr?.manpower || 500;
    const supplies_cost = cost_inr?.supplies || 200;
    const total_cost = manpower_cost + supplies_cost;

    db.prepare(`
      INSERT INTO budget_log (maintenance_id, manpower_cost, supplies_cost, total_cost, response_time_mins, logged_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, manpower_cost, supplies_cost, total_cost, response_time_mins, completed_at);

    // Reset Facility Cleanliness
    db.prepare(`
      INSERT INTO cleanliness_status (facility_id, status, reason, updated_at)
      VALUES (?, 'GREEN', 'Sanitization completed by cleaner', ?)
    `).run(task.facility_id, completed_at);

    res.json({ status: 'success', response_time_mins });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
