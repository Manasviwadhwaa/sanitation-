import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/setup.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sanitrax_secure_vault_2026';

// 1. Unified Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user with role details
    let user: any = db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = ? AND u.is_active = 1
    `).get(username) as any;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    // Fetch Permissions for this role
    const permissions = db.prepare(`
      SELECT p.module, p.action 
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `).all(user.role_id) as any[];

    const permissionStrings = permissions.map(p => `${p.action}:${p.module}`);

    // Create Audit Log for Login
    db.prepare(`
      INSERT INTO audit_logs (actor_id, actor_role, event_type, module, ip_address)
      VALUES (?, ?, 'AUTH', 'SESSION', ?)
    `).run(user.id, user.role_name, req.ip);

    // Sign Token with rich payload
    const token = jwt.sign({ 
      id: user.id, 
      role: user.role_name, 
      username: user.username,
      name: user.name,
      permissions: permissionStrings
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role_name,
        permissions: permissionStrings 
      }
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Authentication gateway failure' });
  }
});

// 2. Profile Endpoint
router.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// 3. Permission Validation Helper (Internal)
router.post('/validate-action', authenticate, (req: AuthRequest, res) => {
  const { module, action } = req.body;
  const permission = `${action}:${module}`;
  
  if (req.user?.permissions?.includes(permission)) {
    return res.json({ allowed: true });
  }
  res.status(403).json({ allowed: false, error: 'Insufficient permissions' });
});

export default router;
