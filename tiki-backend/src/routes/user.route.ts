import { Router } from 'express';
import { PermissionEnum } from 'prisma/generated/client';
import uploadMulter from '~/configs/multer.config';
import UserController from '~/controllers/user.controller';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const userRouter = Router();

userRouter.get('/', checkLogin, checkPermission(PermissionEnum.VIEW_USERS), UserController.getAllUsers);

userRouter.get('/me', checkLogin, checkPermission(PermissionEnum.VIEW_USERS), UserController.getUserCurrent);

userRouter.get('/location', UserController.getLocation);

userRouter.get('/user', checkLogin, checkPermission(PermissionEnum.VIEW_USERS), UserController.getUserByOne);

userRouter.get('/:userId', checkLogin, checkPermission(PermissionEnum.EDIT_USERS), UserController.getUserById);

userRouter.post('/', UserController.createUser);

userRouter.put('/:userId', checkLogin, checkPermission(PermissionEnum.EDIT_USERS), UserController.updateUser);

userRouter.delete('/:userId', checkLogin, checkPermission(PermissionEnum.EDIT_USERS), UserController.deleteUser);

userRouter.post(
  '/upload-avatar/:userId',
  checkLogin,
  checkPermission(PermissionEnum.EDIT_USERS),
  uploadMulter.single('avatar'),
  UserController.uploadAvatar
);

export default userRouter;
