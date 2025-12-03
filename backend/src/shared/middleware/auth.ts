import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthTokenPayload, UserRole } from '../../features/auth/auth.types';
import { env } from '../config/env';

/**
 * Extended Express request type that includes authenticated user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

/**
 * Middleware to authenticate requests using JWT access tokens
 * Expects Authorization: Bearer <token>
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedJwt = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload | string;

    if (typeof decodedJwt === 'string' || typeof decodedJwt.sub !== 'number') {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    const decoded: AuthTokenPayload = {
      sub: decodedJwt.sub,

      role: decodedJwt.role as UserRole,
    };

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Middleware factory to enforce role-based access control
 * @param allowedRoles - Roles that are allowed to access the route
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };
}
