import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import httpStatus from 'http-status';

export const validateRequest =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        data: null,
        errorDetails: err?.errors ?? err,
      });
    }
  };
