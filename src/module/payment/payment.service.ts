import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import stripe from '../../config/stripe';
import config from '../../config';
import { AppError } from '../../utils/AppError';
import { ICreatePaymentPayload } from './payment.interface';
import Stripe from 'stripe';

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

const handleWebhookEvent = async (event: Stripe.Event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const payment = await prisma.payment.findUnique({
      where: { transactionId: session.id },
    });

    if (!payment) {
      console.error('Webhook received for unknown session:', session.id);
      return;
    }

    if (payment.status === 'COMPLETED') {
      return; // already processed — avoid double-processing if Stripe retries the webhook
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED', paidAt: new Date() },
      }),
      prisma.rentalRequest.update({
        where: { id: payment.rentalRequestId },
        data: { status: 'ACTIVE' },
      }),
    ]);
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.payment.updateMany({
      where: { transactionId: session.id, status: 'PENDING' },
      data: { status: 'FAILED' },
    });
  }
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: { rentalRequest: { include: { property: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getPaymentById = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { rentalRequest: { include: { property: true } } },
  });

  if (!payment) {
    throw new AppError('Payment not found', httpStatus.NOT_FOUND);
  }

  const isOwner = payment.userId === userId;

  if (role !== 'ADMIN' && !isOwner) {
    throw new AppError(
      'You do not have access to this payment',
      httpStatus.FORBIDDEN,
    );
  }

  return payment;
};

export const PaymentServices = {
  createPaymentSession,
  handleWebhookEvent,
  getMyPayments,
  getPaymentById,
};
