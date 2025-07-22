import type { Request, Response } from 'express';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { response } from '~/libs/utils/response.util';
import OrderService from '~/services/order.service';
import SocketService from '~/services/socket.service';

// import { webSocketService } from '~/services/webSocket.service';

class OrderController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { items, meta } = await OrderService.getAll(req.query);
      response.paginate(res, items, meta, MESSAGES.ORDERS_RETRIEVED);
    } catch (error: any) {
      response.error(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.getById(req.params.uuid);
      response.success(res, order, MESSAGES.ORDER_RETRIEVED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.create(req.body);
      response.success(res, order, MESSAGES.ORDER_CREATED);
    } catch (error: any) {
      response.error(res, error);
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.updateStatus(req.params.uuid, req.body);

      const orderWithUser = await prisma.orders.findUnique({
        where: {
          uuid: req.params.uuid,
        },
        include: {
          user: {
            select: {
              id: true,
              uuid: true,
            },
          },
        },
      });

      console.log('id user:', orderWithUser?.user?.uuid);

      const user_id = orderWithUser?.user?.uuid;

      if (order) {
        console.log(`emitRoom user_${user_id}`);
        SocketService.emitToRoom(`user_${user_id}`, 'orderUpdated', 'updated');
      }

      response.success(res, order, MESSAGES.ORDER_STATUS_UPDATED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await OrderService.delete(req.params.uuid);
      response.success(res, null, MESSAGES.ORDER_DELETED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }
}

export default new OrderController();
