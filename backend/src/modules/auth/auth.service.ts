import { prisma } from '@/shared/config/database.js';
import { hashPassword, comparePassword } from '@/shared/utils/hash.util.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/shared/utils/token.util.js';
import type { RegisterInput, LoginInput, AuthResponse } from './auth.types.js';

const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60;

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    const error = new Error('User already exists with this email');
    (error as Error & { statusCode?: number }).statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
    },
  });

  const accessToken = generateAccessToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ sub: user.id, email: user.email });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    const error = new Error('Invalid email or password');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    const error = new Error('Invalid email or password');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ sub: user.id, email: user.email });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS,
  };
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const payload = verifyRefreshToken(refreshToken);

  const stored = await prisma.refreshToken.findFirst({
    where: { token: refreshToken, userId: payload.sub },
  });
  if (!stored || stored.expiresAt < new Date()) {
    const error = new Error('Invalid or expired refresh token');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
  const newAccessToken = generateAccessToken({ sub: user.id, email: user.email });
  const newRefreshToken = generateRefreshToken({ sub: user.id, email: user.email });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS,
  };
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
}
