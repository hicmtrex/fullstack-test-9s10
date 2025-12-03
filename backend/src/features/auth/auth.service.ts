import bcrypt from 'bcryptjs';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { AuthTokenPayload, AuthTokens, LoginDto, RegisterDto, User, UserRole } from './auth.types';
import { env } from '../../shared/config/env';
import { logger } from '../../shared/config/logger';

/**
 * Auth Service
 * Handles user registration, login, and token management
 */
export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Register a new user
   * @param dto - Registration data
   */
  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const role: UserRole = dto.role ?? 'user';

    const user = await this.authRepository.create(dto.email, passwordHash, role);
    logger.info('User registered', { userId: user.id, role: user.role });
    return user;
  }

  /**
   * Login an existing user and return tokens
   * @param dto - Login credentials
   */
  async login(dto: LoginDto): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.password_hash);

    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  /**
   * Refresh access token using a refresh token
   * @param refreshToken - Refresh token
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const decodedJwt = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload | string;

      if (typeof decodedJwt === 'string' || typeof decodedJwt.sub !== 'number') {
        throw new Error('Invalid token payload');
      }

      const decoded: AuthTokenPayload = {
        sub: decodedJwt.sub,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (decodedJwt as any).role as UserRole,
      };

      const user = await this.authRepository.findById(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      logger.warn('Invalid refresh token', error);
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Generate access and refresh tokens for a user
   * @param user - Authenticated user
   */
  private generateTokens(user: User): AuthTokens {
    const payload: AuthTokenPayload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);

    return { accessToken, refreshToken };
  }
}
