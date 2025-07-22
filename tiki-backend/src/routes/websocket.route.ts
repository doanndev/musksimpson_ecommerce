// import { Router } from 'express';
// import { PermissionEnum } from 'prisma/generated/client';
// import WebsocketController from '~/controllers/websocket.controller';
// import { checkLogin } from '~/middleware/checkLogin.middleware';
// import { checkPermission } from '~/middleware/checkPermission.middleware';

// const websocketRouter = Router();
// websocketRouter.post(
//   '/emit',
//   checkLogin,
//   checkPermission(PermissionEnum.MANAGE_ORDERS),
//   WebsocketController.emitOrderStatusUpdate
// );

// export default websocketRouter;
