import { Router } from 'express';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { PermissionEnum } from 'prisma/generated/client';
import CartItemController from '~/controllers/cart-item.controller';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const cartItemRouter = Router();

cartItemRouter.get('/user/:user_id', checkLogin, CartItemController.getAllByUser);

cartItemRouter.post('/', checkLogin, CartItemController.create);

cartItemRouter.put('/:id', checkLogin, CartItemController.update);

cartItemRouter.delete('/:id', checkLogin, CartItemController.delete);

cartItemRouter.get(
  '/admin/user/:user_id',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_ORDERS),
  CartItemController.getAllByUser
);

cartItemRouter.post('/admin', checkLogin, checkPermission(PermissionEnum.MANAGE_ORDERS), CartItemController.create);

cartItemRouter.put('/admin/:id', checkLogin, checkPermission(PermissionEnum.MANAGE_ORDERS), CartItemController.update);

cartItemRouter.delete(
  '/admin/:id',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_ORDERS),
  CartItemController.delete
);

export default cartItemRouter;
