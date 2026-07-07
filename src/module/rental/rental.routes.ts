import { Router } from 'express';
import { RentalControllers } from './rental.controller';
import { authenticate, restrictTo } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createRentalRequestValidationSchema,
  updateRentalStatusValidationSchema,
} from './rental.validation';

const router = Router();

router.post(
  '/',
  authenticate,
  restrictTo('TENANT'),
  validateRequest(createRentalRequestValidationSchema),
  RentalControllers.createRentalRequest,
);

router.get(
  '/',
  authenticate,
  restrictTo('TENANT'),
  RentalControllers.getMyRentalRequests,
);
router.get('/:id', authenticate, RentalControllers.getRentalRequestById);

router.get(
  '/landlord/requests',
  authenticate,
  restrictTo('LANDLORD'),
  RentalControllers.getLandlordRentalRequests,
);

router.patch(
  '/:id/status',
  authenticate,
  restrictTo('LANDLORD'),
  validateRequest(updateRentalStatusValidationSchema),
  RentalControllers.updateRentalStatus,
);

export const RentalRoutes = router;
