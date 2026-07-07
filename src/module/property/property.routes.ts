import { Router } from 'express';
import { PropertyControllers } from './property.controller';

const router = Router();

router.get('/', PropertyControllers.getAllProperties);
router.get('/:id', PropertyControllers.getPropertyById);

export const PropertyRoutes = router;
