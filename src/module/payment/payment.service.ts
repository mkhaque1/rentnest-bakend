import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import stripe from '../../config/stripe';
import config from '../../config';
import { AppError } from '../../utils/AppError';
import { ICreatePaymentPayload } from './payment.interface';

const createPaymentSession = async (
  tenantId: string,
  payload: ICreatePaymentPayload,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { property: true, payment: true },
  });

  if (!rental) {
    throw new AppError('Rental request not found', httpStatus.NOT_FOUND);
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(
      'You can only pay for your own rental requests',
      httpStatus.FORBIDDEN,
    );
  }

  if (rental.status !== 'APPROVED') {
    throw new AppError(
      'Payment can only be made for an approved rental request',
      httpStatus.BAD_REQUEST,
    );
  }

  if (rental.payment) {
    throw new AppError(
      'A payment already exists for this rental request',
      httpStatus.CONFLICT,
    );
  }

  const amountInCents = Math.round(rental.property.price * 100);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Rent payment - ${rental.property.title}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/api/payments/cancel`,
    metadata: {
      rentalRequestId: rental.id,
      tenantId,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      transactionId: session.id,
      rentalRequestId: rental.id,
      userId: tenantId,
      amount: rental.property.price,
      provider: 'STRIPE',
      status: 'PENDING',
    },
  });

  return { checkoutUrl: session.url, payment };
};

export const PaymentServices = { createPaymentSession };
