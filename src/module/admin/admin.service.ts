import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { IUpdateUserStatusPayload } from './admin.interface';

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const updateUserStatus = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  if (user.role === 'ADMIN') {
    throw new AppError(
      'You cannot change the status of an admin account',
      httpStatus.FORBIDDEN,
    );
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const getAllProperties = async () => {
  return prisma.property.findMany({
    include: {
      landlord: { select: { id: true, name: true, email: true } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getAllRentalRequests = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true, landlordId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const AdminServices = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
