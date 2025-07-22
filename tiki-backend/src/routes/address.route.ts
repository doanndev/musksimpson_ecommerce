import { Router } from 'express';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import AddressController from '~/controllers/address.controller';
import { PermissionEnum } from 'prisma/generated/client';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const addressRouter = Router();

addressRouter.get('/', checkLogin, checkPermission(PermissionEnum.MANAGE_ADDRESSES), AddressController.getAllByUser);
addressRouter.get('/:id', checkLogin, AddressController.getById);
addressRouter.post('/', checkLogin, AddressController.create);
addressRouter.put('/:id', checkLogin, AddressController.update);
addressRouter.delete('/:id', checkLogin, AddressController.delete);

export default addressRouter;
