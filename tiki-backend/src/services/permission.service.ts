import { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import type { PermissionResponseDataType } from '~/libs/schemas/permission.schema';
import PermissionRepository from '~/repositories/permission.repository';

class PermissionService {
  async checkPermission(userId: string, permission: PermissionEnum): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { uuid: userId, is_deleted: false },
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
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    return user.role.role_permissions.some((rp) => rp.permission.name === permission);
  }

  async getAllPermissions(): Promise<PermissionResponseDataType[]> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_PERMISSIONS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const permissions = await PermissionRepository.findAll();
    return permissions.map((perm) => ({
      id: perm.id,
      name: perm.name,
      created_at: perm.created_at,
      updated_at: perm.updated_at,
    }));
  }

  async getPermissionById(permissionId: string): Promise<PermissionResponseDataType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_PERMISSIONS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const permission = await PermissionRepository.findById(permissionId);
    if (!permission) {
      throw new Error(MESSAGES.PERMISSION_NOT_FOUND);
    }

    return {
      id: permission.id,
      name: permission.name,
      created_at: permission.created_at,
      updated_at: permission.updated_at,
    };
  }
}

export default new PermissionService();
