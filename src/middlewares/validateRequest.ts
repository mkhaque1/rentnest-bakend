import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
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
      if (err instanceof ZodError) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          data: null,
          errorDetails: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      next(err);
    }
  };
