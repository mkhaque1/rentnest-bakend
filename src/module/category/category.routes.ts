import { Router } from 'express';
import { CategoryControllers } from './category.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from './category.validation';
import { authenticate, restrictTo } from '../../middlewares/auth';

const router = Router();

// for Public
router.get('/', CategoryControllers.getAllCategories);
router.get('/:id', CategoryControllers.getCategoryById);

// for Admin only
router.post(
  '/',
  authenticate,
  restrictTo('ADMIN'),
  validateRequest(createCategoryValidationSchema),
  CategoryControllers.createCategory,
);
router.patch(
  '/:id',
  authenticate,
  restrictTo('ADMIN'),
  validateRequest(updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);
router.delete(
  '/:id',
  authenticate,
  restrictTo('ADMIN'),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
