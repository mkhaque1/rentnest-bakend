import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import { authenticate, restrictTo } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateUserStatusValidationSchema } from './admin.validation';

const router = Router();

router.use(authenticate, restrictTo('ADMIN'));

router.get('/users', AdminControllers.getAllUsers);
router.patch(
  '/users/:id',
  validateRequest(updateUserStatusValidationSchema),
  AdminControllers.updateUserStatus,
);
router.get('/properties', AdminControllers.getAllProperties);
router.get('/rentals', AdminControllers.getAllRentalRequests);

export const AdminRoutes = router;
