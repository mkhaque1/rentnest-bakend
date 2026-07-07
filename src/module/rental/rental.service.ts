import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { ICreateRentalRequestPayload } from './rental.interface';

const createRentalRequest = async (
  tenantId: string,
  payload: ICreateRentalRequestPayload,
) => {
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new AppError('Property not found', httpStatus.NOT_FOUND);
  }

  if (property.status !== 'AVAILABLE') {
    throw new AppError(
      'This property is not available for rent',
      httpStatus.BAD_REQUEST,
    );
  }

  if (property.landlordId === tenantId) {
    throw new AppError(
      'You cannot rent your own property',
      httpStatus.BAD_REQUEST,
    );
  }

  const existingPending = await prisma.rentalRequest.findFirst({
    where: { tenantId, propertyId: payload.propertyId, status: 'PENDING' },
  });

  if (existingPending) {
    throw new AppError(
      'You already have a pending request for this property',
      httpStatus.CONFLICT,
    );
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate: new Date(payload.moveInDate),
      message: payload.message,
    },
  });
};

const getMyRentalRequests = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: { tenantId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getRentalRequestById = async (
  id: string,
  userId: string,
  role: string,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true } },
    },
  });

  if (!rental) {
    throw new AppError('Rental request not found', httpStatus.NOT_FOUND);
  }

  const isOwnerTenant = rental.tenantId === userId;
  const isOwnerLandlord = rental.property.landlordId === userId;

  if (role !== 'ADMIN' && !isOwnerTenant && !isOwnerLandlord) {
    throw new AppError(
      'You do not have access to this rental request',
      httpStatus.FORBIDDEN,
    );
  }

  return rental;
};

export const RentalServices = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
};
