import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/setup.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'saaf_secure_gateway_2026';

router.post('/login', async (req, res) => {
  try {
    const { role, username, password, cleaner_id, pin } = req.body;

    if (role === 'admin') {
      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const token = jwt.sign({ id: user.id, role: 'admin', username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        token,
        user: { id: user.id, name: user.name, role: 'admin' }
      });
    } 
    
    if (role === 'cleaner') {
      const cleaner = db.prepare('SELECT * FROM cleaners WHERE cleaner_id = ?').get(cleaner_id) as any;
      if (!cleaner || !(await bcrypt.compare(pin, cleaner.pin_hash))) {
        return res.status(401).json({ error: 'Invalid cleaner ID or PIN' });
      }

      const token = jwt.sign({ id: cleaner.id, role: 'cleaner', cleaner_id: cleaner.cleaner_id }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        token,
        user: { id: cleaner.id, name: cleaner.name, role: 'cleaner' }
      });
    }

    res.status(400).json({ error: 'Invalid role specified' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
