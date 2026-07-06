import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import { AppError } from '../../utils/AppError';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { IRegisterPayload, ILoginPayload, IAuthResult } from './auth.interface';

// signup for user

const register = async (payload: IRegisterPayload): Promise<IAuthResult> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new AppError('Email is already registered', httpStatus.CONFLICT);
  }

  const passwordHash = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role,
      phone: payload.phone,
    },
  });

  const tokenPayload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

// login for user

const login = async (payload: ILoginPayload): Promise<IAuthResult> => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  const passwordMatches = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  if (user.status === 'BANNED') {
    throw new AppError('This account has been banned', httpStatus.FORBIDDEN);
  }

  const tokenPayload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const AuthServices = { register, login };
