import type { Request, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { response } from '~/libs/utils/response.util';
import CartItemService from '~/services/cart-item.service';

class CartItemController {
  async getAllByUser(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.params.user_id;
      const cartItems = await CartItemService.getAllByUser(user_id);
      response.success(res, cartItems, MESSAGES.CART_ITEMS_RETRIEVED);
    } catch (error: any) {
      response.error(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const cartItem = await CartItemService.create(req.body);
      response.success(res, cartItem, MESSAGES.CART_ITEM_ADDED);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const cartItem = await CartItemService.update(id, req.body);
      response.success(res, cartItem, MESSAGES.CART_ITEM_UPDATED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await CartItemService.delete(id);
      response.success(res, null, MESSAGES.CART_ITEM_DELETED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }
}

export default new CartItemController();
