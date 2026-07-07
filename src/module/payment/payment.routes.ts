import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import { authenticate, restrictTo } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createPaymentValidationSchema } from './payment.validation';

const router = Router();

router.post(
  '/create',
  authenticate,
  restrictTo('TENANT'),
  validateRequest(createPaymentValidationSchema),
  PaymentControllers.createPaymentSession,
);

router.get('/', authenticate, PaymentControllers.getMyPayments);
router.get('/:id', authenticate, PaymentControllers.getPaymentById);

const webhookRouter = Router();
webhookRouter.post('/', PaymentControllers.handleStripeWebhook);

export const StripeWebhookRoute = webhookRouter;

export const PaymentRoutes = router;
