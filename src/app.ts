import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

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

// (module routes will be added here in upcoming steps)

app.use(notFound);
app.use(errorHandler);

export default app;
