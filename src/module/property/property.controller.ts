import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PropertyServices } from './property.service';
import { AuthRequest } from '../../middlewares/auth';

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

const createProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await PropertyServices.createProperty(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Property created successfully',
    data: result,
  });
});

const updateProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await PropertyServices.updateProperty(
    req.params.id as string,
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  await PropertyServices.deleteProperty(req.params.id as string, req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property deleted successfully',
    data: null,
  });
});

const getMyProperties = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await PropertyServices.getMyProperties(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your properties retrieved successfully',
    data: result,
  });
});

export const PropertyControllers = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
