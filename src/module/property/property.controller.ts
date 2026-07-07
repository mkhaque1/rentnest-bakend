import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PropertyServices } from './property.service';

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const { properties, meta } = await PropertyServices.getAllProperties(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Properties retrieved successfully',
    data: properties,
    meta,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyServices.getPropertyById(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property retrieved successfully',
    data: result,
  });
});

export const PropertyControllers = { getAllProperties, getPropertyById };
