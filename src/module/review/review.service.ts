import httpStatus from 'http-status';

import { AppError } from '../../utils/AppError';
import { ICreateReviewPayload } from './review.interface';
import { prisma } from '../../lib/prisma';

const createReview = async (
  tenantId: string,
  payload: ICreateReviewPayload,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { review: true },
  });

  if (!rental) {
    throw new AppError('Rental request not found', httpStatus.NOT_FOUND);
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(
      'You can only review your own rentals',
      httpStatus.FORBIDDEN,
    );
  }

  if (rental.status !== 'COMPLETED') {
    throw new AppError(
      'You can only review a completed rental',
      httpStatus.BAD_REQUEST,
    );
  }

  if (rental.review) {
    throw new AppError(
      'You have already reviewed this rental',
      httpStatus.CONFLICT,
    );
  }

  return prisma.review.create({
    data: {
      rentalRequestId: rental.id,
      propertyId: rental.propertyId,
      tenantId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

const getPropertyReviews = async (propertyId: string) => {
  return prisma.review.findMany({
    where: { propertyId },
    include: { tenant: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const ReviewServices = { createReview, getPropertyReviews };
