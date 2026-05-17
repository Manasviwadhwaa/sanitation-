import express from 'express';
import { db } from '../db/setup.js';
import { authenticate, requirePermission, AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';
import { io } from '../socket.js';

const router = express.Router();

// 1. PUBLIC: Get Transparency Summary
router.get('/public-summary', async (req, res) => {
  try {
    const summary = db.prepare(`
      SELECT 
        SUM(amount) as total_approved_spend,
        COUNT(*) as record_count,
        AVG(amount) as avg_cost
      FROM budget_log
      WHERE approval_state = 'APPROVED' AND is_public_visibility = 1
    `).get() as any;

    res.json({
      total_spent: summary.total_approved_spend || 0,
      verified_records: summary.record_count || 0,
      avg_cost: summary.avg_cost || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Alias for frontend compatibility
router.get('/summary', async (req, res) => {
  try {
    const summary = db.prepare(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_spent,
        COUNT(*) as total_tasks
      FROM budget_log
      WHERE approval_state = 'APPROVED'
    `).get() as any;
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. PUBLIC: Get Approved Line Items
router.get('/public-items', async (req, res) => {
  try {
    const items = db.prepare(`
      SELECT b.*, f.name as facility_name
      FROM budget_log b
      JOIN facilities f ON b.facility_id = f.id
      WHERE b.approval_state = 'APPROVED' AND b.is_public_visibility = 1
      ORDER BY b.created_at DESC LIMIT 50
    `).all();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Alias for frontend compatibility
router.get('/line-items', async (req, res) => {
  try {
    const items = db.prepare(`
      SELECT b.*, f.name as facility_name
      FROM budget_log b
      JOIN facilities f ON b.facility_id = f.id
      ORDER BY b.created_at DESC LIMIT 50
    `).all();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ADMIN: Get Full Ledger (Finance/Admin only)
router.get('/admin-ledger', authenticate, requirePermission('READ', 'BUDGET'), async (req: AuthRequest, res) => {
  try {
    const logs = db.prepare(`
      SELECT b.*, f.name as facility_name, u.name as approver_name
      FROM budget_log b
      JOIN facilities f ON b.facility_id = f.id
      LEFT JOIN users u ON b.approved_by_id = u.id
      ORDER BY b.created_at DESC
    `).all();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. ADMIN: Create Budget Entry
router.post('/create', authenticate, requirePermission('WRITE', 'BUDGET'), async (req: AuthRequest, res) => {
  try {
    const { facility_id, amount, category, description, is_public } = req.body;
    
    const info = db.prepare(`
      INSERT INTO budget_log (facility_id, amount, category, description, is_public_visibility, created_at, approval_state)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
    `).run(facility_id, amount, category, description, is_public ? 1 : 0, new Date().toISOString());

    const recordId = info.lastInsertRowid;

    await logAudit({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      eventType: 'DATA_CHANGE',
      module: 'BUDGET',
      recordId: Number(recordId),
      afterPayload: { amount, category, facility_id },
      ipAddress: req.ip
    });

    res.json({ id: recordId, status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. ADMIN: Approve Budget Entry
router.put('/:id/approve', authenticate, requirePermission('APPROVE', 'BUDGET'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { is_public } = req.body;

    const before = db.prepare('SELECT * FROM budget_log WHERE id = ?').get(id);

    db.prepare(`
      UPDATE budget_log 
      SET approval_state = 'APPROVED', approved_by_id = ?, is_public_visibility = ?
      WHERE id = ?
    `).run(req.user!.id, is_public ? 1 : 0, id);

    await logAudit({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      eventType: 'BUDGET_APPROVAL',
      module: 'BUDGET',
      recordId: Number(id),
      beforePayload: before,
      afterPayload: { approval_state: 'APPROVED', is_public },
      ipAddress: req.ip
    });

    if (is_public) {
      io.emit('budget_update', { message: 'New transparency data released' });
    }

    res.json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
