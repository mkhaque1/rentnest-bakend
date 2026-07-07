import { Router } from 'express';
import { PropertyControllers } from './property.controller';
import { authenticate, restrictTo } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
} from './property.validation';

const router = Router();

router.get('/', PropertyControllers.getAllProperties);
router.get('/:id', PropertyControllers.getPropertyById);

router.get(
  '/my/listings',
  authenticate,
  restrictTo('LANDLORD'),
  PropertyControllers.getMyProperties,
);

router.post(
  '/',
  authenticate,
  restrictTo('LANDLORD'),
  validateRequest(createPropertyValidationSchema),
  PropertyControllers.createProperty,
);

router.patch(
  '/:id',
  authenticate,
  restrictTo('LANDLORD'),
  validateRequest(updatePropertyValidationSchema),
  PropertyControllers.updateProperty,
);

router.delete(
  '/:id',
  authenticate,
  restrictTo('LANDLORD'),
  PropertyControllers.deleteProperty,
);

export const PropertyRoutes = router;
