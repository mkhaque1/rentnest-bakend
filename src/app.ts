import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { AuthRoutes } from './module/auth/auth.routes';
import { CategoryRoutes } from './module/category/category.routes';
import { PropertyRoutes } from './module/property/property.routes';
import { RentalRoutes } from './module/rental/rental.routes';
import {
  PaymentRoutes,
  StripeWebhookRoute,
} from './module/payment/payment.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  StripeWebhookRoute,
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: 'RentNest API is running', data: null });
});

// (all module routes will be added here)

app.use('/api/auth', AuthRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/properties', PropertyRoutes);
app.use('/api/rentals', RentalRoutes);
app.use('/api/payments', PaymentRoutes);

// not found and error pages
app.use(notFound);
app.use(errorHandler);

export default app;
