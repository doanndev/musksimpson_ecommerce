import { Router } from 'express';
import { PermissionEnum } from 'prisma/generated/client';
import ShopController from '~/controllers/shop.controller';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const shopRouter = Router();

shopRouter.get('/', checkLogin, checkPermission([PermissionEnum.VIEW_SHOP]), ShopController.getAll);

shopRouter.get('/:shopId', checkLogin, checkPermission([PermissionEnum.VIEW_SHOP]), ShopController.getById);

shopRouter.post('/', checkLogin, checkPermission([PermissionEnum.CREATE_SHOP]), ShopController.create);

shopRouter.put('/:shopId', checkLogin, checkPermission([PermissionEnum.EDIT_SHOP]), ShopController.update);

shopRouter.delete('/:shopId', checkLogin, checkPermission([PermissionEnum.DELETE_SHOP]), ShopController.delete);

export default shopRouter;
