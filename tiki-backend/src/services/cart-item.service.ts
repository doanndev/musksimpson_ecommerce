import { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import {
  CartItemCreateInputSchema,
  CartItemResponseSchema,
  type CartItemResponseType,
  CartItemUpdateInputSchema,
} from '~/libs/schemas/cart-item.schema';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import CartItemRepository from '~/repositories/cart-item.repository';
import UserRepository from '~/repositories/user.repository';
import productService from './product.service';

class CartItemService {
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

  async getAllByUser(user_id: string): Promise<CartItemResponseType[]> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);
    if (!hasPermission && user_id !== reqUser.userId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const cartItems = await CartItemRepository.findAllByUser(user_id);
    const cartItemPromises = cartItems.map(async (item) => {
      const product = await productService.getById(item.product.uuid);
      console.log({ product });
      return CartItemResponseSchema.parse({
        ...item,
        product,
      });
    });

    return Promise.all(cartItemPromises);
  }

  async create(data: unknown): Promise<CartItemResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const parsedData = CartItemCreateInputSchema.parse(data);
    if (parsedData.user_id !== reqUser.userId) {
      const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);
      if (!hasPermission) {
        throw new Error(MESSAGES.FORBIDDEN);
      }
    }

    const cartItem = await CartItemRepository.create(parsedData);
    const product = await productService.getById(cartItem.product.uuid);
    return CartItemResponseSchema.parse({
      ...cartItem,
      product,
    });
  }

  async update(id: number, data: unknown): Promise<CartItemResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const cartItem = await CartItemRepository.findById(id);
    if (!cartItem) {
      throw new Error(MESSAGES.CART_ITEM_NOT_FOUND);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);

    const user = await UserRepository.findById(reqUser.userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    if (!hasPermission && cartItem.user_id !== user.id) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = CartItemUpdateInputSchema.parse(data);
    const updatedCartItem = await CartItemRepository.update(id, parsedData);
    const product = await productService.getById(cartItem.product.uuid);
    return CartItemResponseSchema.parse({
      ...updatedCartItem,
      product,
    });
  }

  async delete(id: number): Promise<void> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const cartItem = await CartItemRepository.findById(id);
    if (!cartItem) {
      throw new Error(MESSAGES.CART_ITEM_NOT_FOUND);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);

    const user = await UserRepository.findById(reqUser.userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    if (!hasPermission && cartItem.user_id !== user.id) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    await CartItemRepository.delete(id);
  }
}

export default new CartItemService();
