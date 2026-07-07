import { Response, Request } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/cathAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth';
import { PaymentServices } from './payment.service';
import stripe from '../../config/stripe';
import config from '../../config';
import { AppError } from '../../utils/AppError';

const createPaymentSession = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const result = await PaymentServices.createPaymentSession(
      req.user!.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Payment session created successfully',
      data: result,
    });
  },
);

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret,
    );
  } catch (err: any) {
    throw new AppError(
      `Webhook signature verification failed: ${err.message}`,
      httpStatus.BAD_REQUEST,
    );
  }

  await PaymentServices.handleWebhookEvent(event);

  res.status(httpStatus.OK).json({ received: true });
});

export const PaymentControllers = { createPaymentSession, handleStripeWebhook };
