import express, { Response, Request } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'RentNest API is running' });
});

export default app;
