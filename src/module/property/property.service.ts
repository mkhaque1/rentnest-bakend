import httpStatus from 'http-status';

import { AppError } from '../../utils/AppError';
import {
  IPropertyFilters,
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
} from './property.interface';
import { prisma } from '../../lib/prisma';

const getAllProperties = async (filters: IPropertyFilters) => {
  const {
    location,
    minPrice,
    maxPrice,
    type,
    categoryId,
    page = 1,
    limit = 10,
  } = filters;

  const where: any = { status: 'AVAILABLE' };

  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (type) where.type = { equals: type, mode: 'insensitive' };
  if (categoryId) where.categoryId = categoryId;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        landlord: { select: { id: true, name: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    meta: { page: Number(page), limit: Number(limit), total },
  };
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { category: true, landlord: { select: { id: true, name: true } } },
  });

  if (!property) {
    throw new AppError('Property not found', httpStatus.NOT_FOUND);
  }

  return property;
};

const createProperty = async (
  landlordId: string,
  payload: ICreatePropertyPayload,
) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  if (!category) {
    throw new AppError('Category not found', httpStatus.NOT_FOUND);
  }

  return prisma.property.create({
    data: { ...payload, landlordId },
  });
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  payload: IUpdatePropertyPayload,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) {
    throw new AppError('Property not found', httpStatus.NOT_FOUND);
  }
  if (property.landlordId !== landlordId) {
    throw new AppError(
      'You can only update your own properties',
      httpStatus.FORBIDDEN,
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!category) {
      throw new AppError('Category not found', httpStatus.NOT_FOUND);
    }
  }

  return prisma.property.update({ where: { id: propertyId }, data: payload });
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) {
    throw new AppError('Property not found', httpStatus.NOT_FOUND);
  }
  if (property.landlordId !== landlordId) {
    throw new AppError(
      'You can only delete your own properties',
      httpStatus.FORBIDDEN,
    );
  }

  await prisma.property.delete({ where: { id: propertyId } });
};

const getMyProperties = async (landlordId: string) => {
  return prisma.property.findMany({
    where: { landlordId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const PropertyServices = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
