import { Router } from 'express';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { PermissionEnum } from 'prisma/generated/client';
import PermissionController from '~/controllers/permission.controller';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const permissionRouter = Router();

permissionRouter.get(
  '/',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_PERMISSIONS),
  PermissionController.getAllPermissions
);

permissionRouter.get(
  '/:permissionId',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_PERMISSIONS),
  PermissionController.getPermissionById
);

export default permissionRouter;
