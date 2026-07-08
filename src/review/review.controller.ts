import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/cathAsync';
import { sendResponse } from '../utils/sendResponse';
import { AuthRequest } from '../middlewares/auth';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await ReviewServices.createReview(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getPropertyReviews(
    req.params.propertyId as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property reviews retrieved successfully',
    data: result,
  });
});

export const ReviewControllers = { createReview, getPropertyReviews };
