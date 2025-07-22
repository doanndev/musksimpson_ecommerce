import CategoryRepository from '~/repositories/category.repository';
import {
  CategoryCreateInputSchema,
  CategoryUpdateInputSchema,
  CategoryResponseSchema,
  type CategoryResponseType,
} from '~/libs/schemas/category.schema';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';

class CategoryService {
  private async checkPermission(userId: string, permission: PermissionEnum): Promise<boolean> {
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

  async getAll(query: {
    limit?: number;
    offset?: number;
  }): Promise<CategoryResponseType[]> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    // Không yêu cầu permission đặc biệt cho xem categories
    // Nếu cần, có thể thêm:
    // const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_PRODUCTS);
    // if (!hasPermission) throw new Error(MESSAGES.FORBIDDEN);

    const categories = await CategoryRepository.findAll(query.limit, query.offset);
    return categories.map((category) => CategoryResponseSchema.parse(category));
  }

  async getById(uuid: string): Promise<CategoryResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    // Không yêu cầu permission đặc biệt cho xem category
    // Nếu cần, có thể thêm:
    // const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_PRODUCTS);
    // if (!hasPermission) throw new Error(MESSAGES.FORBIDDEN);

    const category = await CategoryRepository.findById(uuid);
    if (!category) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }
    return CategoryResponseSchema.parse(category);
  }

  async create(data: unknown): Promise<CategoryResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_CATEGORIES);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = CategoryCreateInputSchema.parse(data);
    const category = await CategoryRepository.create(parsedData);
    return CategoryResponseSchema.parse(category);
  }

  async update(uuid: string, data: unknown): Promise<CategoryResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_CATEGORIES);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = CategoryUpdateInputSchema.parse(data);
    const category = await CategoryRepository.findById(uuid);
    if (!category) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }
    const updatedCategory = await CategoryRepository.update(uuid, parsedData);
    return CategoryResponseSchema.parse(updatedCategory);
  }

  async delete(uuid: string): Promise<void> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_CATEGORIES);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const category = await CategoryRepository.findById(uuid);
    if (!category) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }
    await CategoryRepository.delete(uuid);
  }
}

export default new CategoryService();
