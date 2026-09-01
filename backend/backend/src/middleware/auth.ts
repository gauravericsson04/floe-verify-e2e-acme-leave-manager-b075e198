import { Request, Response, NextFunction } from 'express';

// In a real app, replace this with proper JWT/session auth.
// For this minimal example we read a header "x-user-id" and "x-user-role".
export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!userId || !role) {
    return res.status(401).json({ error: 'Missing authentication headers' });
  }
  req.user = { id: userId, role };
  next();
};

// Simple permission checker based on IR definitions.
export const authorize = (action: string, resource: string, scope: 'own' | 'team' | 'all' = 'own') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ error: 'No role' });
    const permission = `${action}:${resource} ${scope}`;
    const rolePermissions: Record<string, string[]> = {
      employee: ['create:LeaveRequest own', 'read:LeaveRequest own'],
      manager: ['read:LeaveRequest team', 'update:LeaveRequest.status team'],
      hr: ['read:LeaveRequest all', 'update:LeaveRequest.status all'],
    };
    const allowed = rolePermissions[role]?.some(p => p.startsWith(`${action}:${resource}`));
    if (!allowed) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
