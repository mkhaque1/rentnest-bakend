import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

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

export const AuthControllers = { register, login };
