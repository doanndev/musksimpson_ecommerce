import { Router } from 'express';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { PermissionEnum } from 'prisma/generated/client';
import CategoryController from '~/controllers/category.controller';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const categoryRouter = Router();

categoryRouter.get('/', checkLogin, CategoryController.getAll);

categoryRouter.get('/:uuid', checkLogin, CategoryController.getById);

categoryRouter.post('/', checkLogin, checkPermission(PermissionEnum.MANAGE_CATEGORIES), CategoryController.create);

categoryRouter.put('/:uuid', checkLogin, checkPermission(PermissionEnum.MANAGE_CATEGORIES), CategoryController.update);

categoryRouter.delete(
  '/:uuid',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_CATEGORIES),
  CategoryController.delete
);

export default categoryRouter;
