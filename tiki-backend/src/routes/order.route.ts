import { Router } from 'express';
import { PermissionEnum } from 'prisma/generated/client';
import OrderController from '~/controllers/order.controller';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const orderRouter = Router();

orderRouter.get('/', checkLogin, checkPermission(PermissionEnum.VIEW_ORDERS), OrderController.getAll);

orderRouter.get('/:uuid', checkLogin, checkPermission(PermissionEnum.VIEW_ORDERS), OrderController.getById);

orderRouter.post('/', checkLogin, checkPermission(PermissionEnum.MANAGE_ORDERS), OrderController.create);

orderRouter.put(
  '/:uuid/status',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_ORDERS),
  OrderController.updateStatus
);

orderRouter.delete('/:uuid', checkLogin, checkPermission(PermissionEnum.MANAGE_ORDERS), OrderController.delete);

export default orderRouter;
