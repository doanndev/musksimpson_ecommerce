import { PermissionEnum, RoleEnum, type users } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import {
  UserCreateInputSchema,
  type UserCreateInputType,
  UserFilterSchema,
  type UserFilterType,
  UserResponseDataSchema,
  type UserResponseDataType,
  UserUpdateInputSchema,
  type UserUpdateInputType,
} from '~/libs/schemas/user.schema';
import type { IPagination } from '~/libs/types/common.types';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import UserRepository from '../repositories/user.repository';

class UserService {
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

  async getAllUsers(query: UserFilterType): Promise<IPagination<UserResponseDataType>> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const user = await prisma.users.findUnique({
      where: { uuid: reqUser.userId, is_deleted: false },
      include: { role: true },
    });

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const parsedQuery = UserFilterSchema.parse(query);
    let where: any = { is_deleted: false };

    if (parsedQuery.search) {
      where.OR = [
        { username: { contains: parsedQuery.search, mode: 'insensitive' } },
        { email: { contains: parsedQuery.search, mode: 'insensitive' } },
      ];
    }

    if (user.role.name === RoleEnum.SELLER) {
      where = {
        ...where,
        is_public: true,
        orders: {
          some: {
            order_items: {
              some: {
                product: {
                  seller_id: user.id,
                },
              },
            },
          },
        },
        NOT: {
          hidden_by_sellers: {
            some: {
              seller_id: user.id,
            },
          },
        },
      };
    } else if (!(await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_USERS))) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const users = await prisma.users.findMany({
      where,
      orderBy: [
        parsedQuery.sort_by_name ? { full_name: parsedQuery.sort_by_name } : {},
        parsedQuery.sort_by_date
          ? { updated_at: parsedQuery.sort_by_date === 'newest' ? 'desc' : 'asc' }
          : { updated_at: 'desc' },
      ],
      take: parsedQuery.limit || 10,
      skip: parsedQuery.offset || 0,
      include: {
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
      },
    });

    const totalItem = await prisma.users.count({ where });

    const limit = parsedQuery.limit || 10;
    const meta = {
      page: Math.floor((parsedQuery.offset || 0) / limit) + 1,
      limit,
      totalPage: Math.ceil(totalItem / limit),
      totalItem,
    };

    const transformedUsers = users.map((user) => UserResponseDataSchema.parse(user));
    return { items: transformedUsers, meta };
  }

  async getUserCurrent(): Promise<UserResponseDataType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_USERS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const user = await UserRepository.findById(reqUser?.userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }
    return UserResponseDataSchema.parse(user);
  }

  async getUserById(userId: string): Promise<UserResponseDataType> {
    console.log("userId", userId);
    
    const reqUser = getRequestUser(); 
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_USERS);
    if (!hasPermission && reqUser.userId !== userId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }
    return UserResponseDataSchema.parse(user);
  }

  async getUserByOne(attributes: Partial<users>, operator: 'AND' | 'OR' = 'AND'): Promise<UserResponseDataType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_USERS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const user = await UserRepository.findByAttributes(attributes, operator);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }
    return UserResponseDataSchema.parse(user);
  }

  async createUser(data: UserCreateInputType): Promise<UserResponseDataType> {
    const parsedData = UserCreateInputSchema.parse(data);
    const existingUser = await UserRepository.findByAttributes(
      { username: parsedData.username, email: parsedData.email },
      'OR'
    );

    if (existingUser) {
      throw new Error(MESSAGES.ACCOUNT_ALREADY_EXISTS);
    }

    const user = await UserRepository.create(parsedData);
    return UserResponseDataSchema.parse(user);
  }

  async updateUser(userId: string, data: UserUpdateInputType): Promise<UserResponseDataType> {

    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.EDIT_USERS);
    if (!hasPermission && reqUser.userId !== userId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = UserUpdateInputSchema.parse(data);
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const updatedUser = await UserRepository.update(userId, parsedData);
    return UserResponseDataSchema.parse(updatedUser);
    
  }

  async deleteUser(userId: string): Promise<UserResponseDataType> {
    console.log("userId", userId);
    
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.EDIT_USERS);
    const user = await UserRepository.findById(reqUser.userId);
    if (!hasPermission || !user || user.role_id !== 1) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const targetUser = await UserRepository.findById(userId);
    if (!targetUser) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }
    const deletedUser = await UserRepository.delete(userId);
    console.log("data", targetUser);
    
    return UserResponseDataSchema.parse(targetUser);
  }

  async uploadAvatar(userId: string, url: string): Promise<UserResponseDataType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.EDIT_USERS);
    if (!hasPermission && reqUser.userId !== userId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const updatedUser = await UserRepository.update(userId, { avatar: url });
    return UserResponseDataSchema.parse(updatedUser);
  }

  async hideUserForSeller(sellerId: string, userId: string): Promise<void> {
    const seller = await prisma.users.findUnique({
      where: { uuid: sellerId, is_deleted: false },
      include: { role: true },
    });

    if (!seller || seller.role.name !== RoleEnum.SELLER) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const user = await prisma.users.findUnique({
      where: { uuid: userId, is_deleted: false },
    });

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    await prisma.seller_hidden_users.create({
      data: {
        seller_id: seller.id,
        user_id: user.id,
      },
    });
  }
}

export default new UserService();
