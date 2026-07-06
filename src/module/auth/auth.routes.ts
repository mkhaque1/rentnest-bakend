import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  registerValidationSchema,
  loginValidationSchema,
} from './auth.validation';

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

export const AuthRoutes = router;
