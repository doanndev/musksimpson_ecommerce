import { prisma } from '~/configs/database.config';
import type { permissions } from 'prisma/generated/client';

class PermissionRepository {
  async findAll(): Promise<permissions[]> {
    return prisma.permissions.findMany({
      where: {},
    });
  }

  async findById(id: string): Promise<permissions | null> {
    return prisma.permissions.findUnique({
      where: { id: parseInt(id) },
    });
  }
}

export default new PermissionRepository();
