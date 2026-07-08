import { Router } from 'express';
import { ReviewControllers } from './review.controller';
import { authenticate, restrictTo } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createReviewValidationSchema } from './review.validation';

const router = Router();

router.post(
  '/',
  authenticate,
  restrictTo('TENANT'),
  validateRequest(createReviewValidationSchema),
  ReviewControllers.createReview,
);

router.get('/property/:propertyId', ReviewControllers.getPropertyReviews);

export const ReviewRoutes = router;
