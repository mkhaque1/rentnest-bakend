import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.updateUserStatus(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User ${result.status === 'BANNED' ? 'banned' : 'unbanned'} successfully`,
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllProperties();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All properties retrieved successfully',
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllRentalRequests();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All rental requests retrieved successfully',
    data: result,
  });
});

export const AdminControllers = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
