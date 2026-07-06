import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';
import { catchAsync } from '../utils/cathAsync';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('You are not logged in', httpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('You are not logged in', httpStatus.UNAUTHORIZED);
    }

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new AppError('This user no longer exists', httpStatus.UNAUTHORIZED);
    }

    if (user.status === 'BANNED') {
      throw new AppError('This account has been banned', httpStatus.FORBIDDEN);
    }

    req.user = { id: user.id, role: user.role };
    next();
  },
);

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        httpStatus.FORBIDDEN,
      );
    }
    next();
  };
