import type { Request, Response } from 'express';
import CategoryService from '~/services/category.service';
import { response } from '~/libs/utils/response.util';
import { MESSAGES } from '~/libs/constants/messages.constant';

class CategoryController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const query = {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      };
      const categories = await CategoryService.getAll(query);
      response.success(res, categories, MESSAGES.CATEGORIES_RETRIEVED);
    } catch (error: any) {
      response.error(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.getById(req.params.uuid);
      response.success(res, category, MESSAGES.CATEGORY_RETRIEVED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.create(req.body);
      response.success(res, category, MESSAGES.CATEGORY_CREATED);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.update(req.params.uuid, req.body);
      response.success(res, category, MESSAGES.CATEGORY_UPDATED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await CategoryService.delete(req.params.uuid);
      response.success(res, null, MESSAGES.CATEGORY_DELETED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }
}

export default new CategoryController();
