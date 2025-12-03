import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../shared/middleware/validator';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.validators';
import { loginRateLimiter } from '../../shared/middleware/rateLimiter';

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 */
router.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register.bind(authController)
);

/**
 * @route POST /api/auth/login
 * @description Login an existing user
 */
router.post(
  '/login',
  loginRateLimiter,
  validate(loginSchema, 'body'),
  authController.login.bind(authController)
);

/**
 * @route POST /api/auth/refresh
 * @description Refresh access token using refresh token
 */
router.post(
  '/refresh',
  validate(refreshTokenSchema, 'body'),
  authController.refresh.bind(authController)
);

/**
 * @route POST /api/auth/logout
 * @description Logout current user (clear refresh token cookie)
 */
router.post('/logout', authController.logout.bind(authController));

export default router;
