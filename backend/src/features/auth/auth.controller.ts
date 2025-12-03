import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { logger } from '../../shared/config/logger';

// Initialize dependencies for the auth feature
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

/**
 * Auth Controller
 * Handles HTTP requests related to authentication
 */
export class AuthController {
  /**
   * POST /api/auth/register
   * Registers a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      logger.error('Error registering user', error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticates a user and returns tokens
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await authService.login(req.body);

      // For security, send refresh token as httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        accessToken: tokens.accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error('Error logging in user', error);
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refreshes access token using refresh token cookie or body
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bodyToken = (req.body && req.body.refreshToken) || '';
      const cookieToken = req.cookies?.refreshToken as string | undefined;
      const refreshToken = cookieToken || bodyToken;

      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }

      const tokens = await authService.refresh(refreshToken);

      // Update refresh cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      logger.error('Error refreshing token', error);
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Clears refresh token cookie
   */
  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.status(204).send();
  }
}

export const authController = new AuthController();
