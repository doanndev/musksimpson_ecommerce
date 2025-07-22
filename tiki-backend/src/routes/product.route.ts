import { type NextFunction, type Request, type Response, Router } from 'express';
import { PermissionEnum } from 'prisma/generated/client';
import ProductController from '~/controllers/product.controller';
import { runWithRequestContext, setRequestIP } from '~/libs/utils/requestContext.util';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const productRouter = Router();

// Middleware to set IP in request context
const setIPMiddleware = (req: Request, res: Response, next: NextFunction) => {
  runWithRequestContext(() => {
    // Handle potential headers for IP (e.g., behind proxies)
    const ip = req.headers['x-forwarded-for'] || req.ip || '';
    const clientIP = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();
    setRequestIP(clientIP);
    next();
  });
};

// Apply setIPMiddleware to all routes
productRouter.use(setIPMiddleware);

productRouter.get('/', ProductController.getAll);
productRouter.post('/calculate-fee', ProductController.calculateShippingFee);

productRouter.get('/:uuid', ProductController.getById);

productRouter.post(
  '/',
  checkLogin,
  checkPermission([PermissionEnum.MANAGE_PRODUCTS, PermissionEnum.CREATE_SHOP]),
  ProductController.create
);

productRouter.put(
  '/:uuid',
  checkLogin,
  checkPermission([PermissionEnum.MANAGE_PRODUCTS, PermissionEnum.EDIT_SHOP]),
  ProductController.update
);

productRouter.delete(
  '/:uuid',
  checkLogin,
  checkPermission([PermissionEnum.MANAGE_PRODUCTS, PermissionEnum.DELETE_SHOP]),
  ProductController.delete
);

export default productRouter;
