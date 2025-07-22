import type { Request, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { getInfoFromIP } from '~/libs/utils/getInfoFromIP.util';
import { response } from '~/libs/utils/response.util';
import UserService from '~/services/user.service';

class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { items, meta } = await UserService.getAllUsers(req.query);
      response.paginate(res, items, meta, MESSAGES.USERS_RETRIEVED);
    } catch (error: any) {
      response.error(res, error);
    }
  }

  async getLocation(req: Request, res: Response): Promise<void> {
    try {
      const data = await getInfoFromIP();
      response.success(res, data);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async getUserCurrent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserCurrent();
      response.success(res, user, MESSAGES.USER_RETRIEVED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.userId);
      response.success(res, user, MESSAGES.USER_RETRIEVED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async getUserByOne(req: Request, res: Response): Promise<void> {
    try {
      const { attributes, operator = 'AND' } = req.body;
      const user = await UserService.getUserByOne(attributes, operator);
      response.success(res, user, MESSAGES.USER_RETRIEVED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      response.success(res, user, MESSAGES.USER_CREATED);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.userId, req.body);
      response.success(res, user, MESSAGES.USER_UPDATED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const deletedUser = await UserService.deleteUser(req.params.userId);
      response.success(res, deletedUser, MESSAGES.USER_DELETED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;
      const user = await UserService.uploadAvatar(req.params.userId, url);
      response.success(res, user, MESSAGES.AVATAR_UPDATED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }
}

export default new UserController();
