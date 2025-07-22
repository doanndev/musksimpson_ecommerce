import type { Application, NextFunction, Request, Response } from 'express';
import type { Server } from 'socket.io';
import { getInfoFromIP } from '~/libs/utils/getInfoFromIP.util';
import { HttpError } from '~/middleware/errorHandler.middleware';
import addressRouter from './address.route';
import authRouter from './auth.route';
import cartItemRouter from './cart-item.route';
import categoryRouter from './category.route';
import chatBotRouter from './chatbot.route';
import orderRouter from './order.route';
import paymentRouter from './payment.route';
import permissionRouter from './permission.route';
import productRouter from './product.route';
import rateLimitRouter from './rateLimit.route';
import reviewRouter from './review.route';
import shopRouter from './shop.routes';
import userRouter from './user.route';

const appRouter = (app: Application, io: Server): void => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/addresses', addressRouter);
  app.use('/api/v1/rate-limit', rateLimitRouter);
  app.use('/api/v1/permissions', permissionRouter);
  app.use('/api/v1/orders', orderRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/cart-items', cartItemRouter);
  app.use('/api/v1/chatbot', chatBotRouter);
  app.use('/api/v1/payments', paymentRouter);
  app.use('/api/v1/shops', shopRouter);
  app.use('/api/v1/reviews', (req, res, next) => reviewRouter(io)(req, res, next));

  app.get('/api/get-location', async (req, res): Promise<void> => {
    try {
      const data = await getInfoFromIP();

      res.status(200).json(data);
    } catch (error: any) {
      console.error('Lỗi khi lấy vị trí:', error.message);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  });

  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new HttpError('The route can not be found!', 404);
    next(error);
  });
};

export default appRouter;
