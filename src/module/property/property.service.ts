import httpStatus from 'http-status';

import { AppError } from '../../utils/AppError';
import { IPropertyFilters } from './property.interface';
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

export const PropertyServices = { getAllProperties, getPropertyById };
