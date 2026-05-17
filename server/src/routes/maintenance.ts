import express from 'express';
import { db } from '../db/setup.js';
import { io } from '../socket.js';
import { authenticate, requirePermission, AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';

const router = express.Router();

// 1. Create Maintenance Task (Supervisor/Admin)
router.post('/create', authenticate, requirePermission('WRITE', 'TASKS'), async (req: AuthRequest, res) => {
  try {
    const { facility_id, issue_reason, assigned_to_id, priority, cost_estimate } = req.body;
    
    const info = db.prepare(`
      INSERT INTO maintenance_tasks (facility_id, issue_reason, assigned_to_id, status, priority, cost_estimate, created_at)
      VALUES (?, ?, ?, 'PENDING', ?, ?, ?)
    `).run(facility_id, issue_reason, assigned_to_id || null, priority || 'MEDIUM', cost_estimate || 0, new Date().toISOString());

    const taskId = info.lastInsertRowid;

    // Audit Log
    await logAudit({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      eventType: 'DATA_CHANGE',
      module: 'TASKS',
      recordId: Number(taskId),
      afterPayload: { facility_id, issue_reason, assigned_to_id, priority },
      ipAddress: req.ip
    });

    io.emit('maintenance_alert', {
      id: taskId,
      facility_id,
      alert_type: 'SYSTEM_TICKET',
      message: issue_reason,
      severity: priority || 'MEDIUM',
      timestamp: new Date().toISOString()
    });

    res.json({ id: taskId, status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Accept Task (Worker)
router.put('/:id/accept', authenticate, requirePermission('WRITE', 'TASKS'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    db.prepare(`
      UPDATE maintenance_tasks 
      SET status = 'IN_PROGRESS', assigned_to_id = ?
      WHERE id = ?
    `).run(req.user!.id, id);

    res.json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Complete Task (Worker) - Moves to pending verification
router.put('/:id/complete', authenticate, requirePermission('WRITE', 'TASKS'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { photo, notes } = req.body;
    
    const task = db.prepare('SELECT * FROM maintenance_tasks WHERE id = ?').get(id) as any;
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const completed_at = new Date().toISOString();

    db.prepare(`
      UPDATE maintenance_tasks 
      SET status = 'COMPLETED', verification_photo = ?, description = ?
      WHERE id = ?
    `).run(photo, notes || 'Completed by worker', id);

    // Audit Log
    await logAudit({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      eventType: 'MAINTENANCE_LOG',
      module: 'TASKS',
      recordId: Number(id),
      afterPayload: { status: 'COMPLETED', photo_uploaded: !!photo },
      ipAddress: req.ip
    });

    io.emit('maintenance_update', {
      task_id: id,
      facility_id: task.facility_id,
      status: 'PENDING_VERIFICATION',
      timestamp: completed_at
    });

    res.json({ status: 'success', message: 'Task submitted for verification' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Verify Task (Supervisor/Inspector) - Finalizes and updates public status
router.put('/:id/verify', authenticate, requirePermission('VERIFY', 'TASKS'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const task = db.prepare('SELECT * FROM maintenance_tasks WHERE id = ?').get(id) as any;
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const verified_at = new Date().toISOString();

    // 1. Update Task
    db.prepare(`
      UPDATE maintenance_tasks 
      SET status = 'VERIFIED', verified_at = ?, verified_by_id = ?
      WHERE id = ?
    `).run(verified_at, req.user!.id, id);

    // 2. Update Facility Status to GREEN (Verified Source)
    db.prepare(`
      INSERT INTO cleanliness_status (facility_id, status, reason, source_type, updated_at, is_verified, verified_by)
      VALUES (?, 'GREEN', ?, 'SUPERVISOR', ?, 1, ?)
    `).run(task.facility_id, notes || 'Verified by supervisor', verified_at, req.user!.id);

    // 3. Audit Log
    await logAudit({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      eventType: 'DATA_CHANGE',
      module: 'TASKS',
      recordId: Number(id),
      afterPayload: { status: 'VERIFIED', verified_by: req.user!.username },
      ipAddress: req.ip
    });

    // 4. Update Budget (Mark as approved if linked)
    db.prepare(`
      UPDATE budget_log SET approval_state = 'APPROVED', approved_by_id = ? 
      WHERE facility_id = ? AND created_at >= ?
    `).run(req.user!.id, task.facility_id, task.created_at);

    io.emit('status_change', {
      facility_id: task.facility_id,
      new_status: 'GREEN',
      reason: 'Maintenance Verified',
      source: 'SUPERVISOR'
    });

    res.json({ status: 'success', message: 'Task verified and public status updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
