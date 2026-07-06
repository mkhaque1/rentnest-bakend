import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { AuthRequest } from '../../middlewares/auth';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await AuthServices.getMe(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Current user retrieved successfully',
    data: result,
  });
});

export const AuthControllers = { register, login, getMe };
