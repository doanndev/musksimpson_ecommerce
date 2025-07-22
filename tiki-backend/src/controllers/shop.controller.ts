import type { NextFunction, Response } from 'express';
import { ShopCreateInputSchema, ShopFilterSchema } from '~/libs/schemas/shop.schema';
import type { AuthRequest } from '~/libs/types/common.types';
import { response } from '~/libs/utils/response.util';
import ShopService from '../services/shop.service';

class ShopController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = ShopFilterSchema.parse(req.query);
      const result = await ShopService.getAll(query);
      response.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId;
      const result = await ShopService.getById(shopId);
      response.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = ShopCreateInputSchema.parse(req.body);
      const result = await ShopService.create(data);
      response.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId;
      const data = ShopCreateInputSchema.parse(req.body);
      const result = await ShopService.update(shopId, data);
      response.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId;
      const result = await ShopService.delete(shopId);
      response.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ShopController();
