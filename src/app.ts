import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { authRoutes } from './module/auth/auth.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: 'RentNest API is running', data: null });
});

// (all module routes will be added here)

app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
