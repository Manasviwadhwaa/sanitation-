import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sanitrax_secure_vault_2026';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    username: string;
    name: string;
    permissions: string[];
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Permission-based Guard
export const requirePermission = (action: string, module: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const requiredPermission = `${action}:${module}`;
    
    if (!req.user || !req.user.permissions.includes(requiredPermission)) {
      console.warn(`🛑 [Access Denied]: User ${req.user?.username} attempted ${requiredPermission}`);
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `You do not have permission to ${action.toLowerCase()} ${module.toLowerCase()} records.` 
      });
    }
    next();
  };
};

// Legacy Role Guard (Refactored to check permissions or role)
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Role not authorized' });
    }
    next();
  };
};
