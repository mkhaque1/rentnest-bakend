import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  registerValidationSchema,
  loginValidationSchema,
} from './auth.validation';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post(
  '/register',
  validateRequest(registerValidationSchema),
  AuthControllers.register,
);
router.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthControllers.login,
);
router.get('/me', authenticate, AuthControllers.getMe);

export const AuthRoutes = router;
