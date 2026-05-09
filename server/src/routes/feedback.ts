import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { facility_id, rating, issue_type } = req.body;
    
    db.prepare(`
      INSERT INTO user_feedback (facility_id, rating, issue_type, timestamp)
      VALUES (?, ?, ?, ?)
    `).run(facility_id, rating, issue_type || 'NONE', new Date().toISOString());

    res.json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
