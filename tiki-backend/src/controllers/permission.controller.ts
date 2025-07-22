import type { Request, Response } from 'express';
import PermissionService from '~/services/permission.service';
import { response } from '~/libs/utils/response.util';
import { MESSAGES } from '~/libs/constants/messages.constant';

class PermissionController {
  async getAllPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await PermissionService.getAllPermissions();
      response.success(res, permissions, MESSAGES.PERMISSIONS_RETRIEVED);
    } catch (error: any) {
      response.error(res, error);
    }
  }

  async getPermissionById(req: Request, res: Response): Promise<void> {
    try {
      const permission = await PermissionService.getPermissionById(req.params.permissionId);
      response.success(res, permission, MESSAGES.PERMISSION_RETRIEVED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }
}

export default new PermissionController();
