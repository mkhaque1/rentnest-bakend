import { Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth';
import { RentalServices } from './rental.service';

const createRentalRequest = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const result = await RentalServices.createRentalRequest(
      req.user!.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Rental request submitted successfully',
      data: result,
    });
  },
);

const getMyRentalRequests = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const result = await RentalServices.getMyRentalRequests(req.user!.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Your rental requests retrieved successfully',
      data: result,
    });
  },
);

const getRentalRequestById = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const result = await RentalServices.getRentalRequestById(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rental request retrieved successfully',
      data: result,
    });
  },
);

const getLandlordRentalRequests = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const result = await RentalServices.getLandlordRentalRequests(req.user!.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rental requests for your properties retrieved successfully',
      data: result,
    });
  },
);

const updateRentalStatus = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const result = await RentalServices.updateRentalStatus(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Rental request ${result.status.toLowerCase()} successfully`,
      data: result,
    });
  },
);

export const RentalControllers = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  getLandlordRentalRequests,
  updateRentalStatus,
};
