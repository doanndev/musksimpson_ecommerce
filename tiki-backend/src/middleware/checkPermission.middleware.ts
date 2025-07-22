import type { NextFunction, Response } from 'express';
import type { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { response } from '~/libs/utils/response.util';

const checkPermission = (requiredPermissions: PermissionEnum | PermissionEnum[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        response.unauthorized(res);
        return;
      }

      const user = await prisma.users.findUnique({
        where: { uuid: req.user.userId },
        include: {
          role: {
            include: {
              role_permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      if (!user) {
        response.notFound(res, MESSAGES.ACCOUNT_DOES_NOT_EXIST);
        return;
      }

      const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
      const hasPermission = permissions.some((permission) =>
        user.role.role_permissions.some((rp) => rp.permission.name === permission)
      );

      if (!hasPermission) {
        response.forbidden(res, MESSAGES.FORBIDDEN);
        return;
      }

      next();
    } catch (error) {
      response.error(res, error);
      return;
    }
  };
};

export { checkPermission };
