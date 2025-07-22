import { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import {
  OrderCreateInputSchema,
  OrderFilterSchema,
  type OrderFilterType,
  OrderResponseSchema,
  type OrderResponseType,
  OrderStatusUpdateSchema,
  type OrderStatusUpdateType,
} from '~/libs/schemas/order.schema';
import type { IPagination } from '~/libs/types/common.types';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import OrderRepository from '~/repositories/order.repository';
import UserRepository from '~/repositories/user.repository';

class OrderService {
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

  async getAll(query: OrderFilterType): Promise<IPagination<OrderResponseType>> {
    const parsedQuery = OrderFilterSchema.parse(query);

    const orders = await OrderRepository.findAll(parsedQuery);
    const totalItem = await OrderRepository.count(parsedQuery);
    const limit = parsedQuery.limit || 10;
    const totalPage = Math.ceil(totalItem / limit);

    const meta = {
      page: Math.floor((parsedQuery.offset || 0) / limit) + 1,
      limit,
      totalPage,
      totalItem,
    };

    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_ORDERS);
    if (!hasPermission && parsedQuery?.user_id !== reqUser.userId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const transformedOrders = orders.map((order) =>
      OrderResponseSchema.parse({
        uuid: order.uuid,
        user: order.user,
        address_id: order.address_id,
        total_amount: order.total_amount,
        status: order.status,
        is_deleted: order.is_deleted,
        items: order.order_items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          product: {
            uuid: item.product.uuid,
            name: item.product.name,
            description: item.product.description,
            new_price: item.product.new_price,
            stock: item.product.stock,
            images: item.product.product_images,
          },
        })),
        created_at: order.created_at,
        updated_at: order.updated_at,
      })
    );

    return {
      items: transformedOrders,
      meta,
    };
  }

  async getById(uuid: string): Promise<OrderResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const order = await OrderRepository.findById(uuid);
    if (!order) {
      throw new Error(MESSAGES.ORDER_NOT_FOUND);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.VIEW_ORDERS);

    const user = await UserRepository.findById(reqUser.userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    if (!hasPermission && order.user_id !== user.id) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    return OrderResponseSchema.parse({
      uuid: order.uuid,
      user_id: order.user_id,
      address_id: order.address_id,
      total_amount: order.total_amount,
      status: order.status,
      is_deleted: order.is_deleted,
      items: order.order_items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        product: {
          uuid: item.product.uuid,
          name: item.product.name,
          description: item.product.description,
          new_price: item.product.new_price,
          stock: item.product.stock,
          images: item.product.product_images,
        },
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
    });
  }

  async create(data: unknown): Promise<OrderResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = OrderCreateInputSchema.parse(data);
    const order = await OrderRepository.create(parsedData);
    return OrderResponseSchema.parse({
      uuid: order.uuid,
      user_id: order.user_id,
      address_id: order.address_id,
      total_amount: order.total_amount,
      status: order.status,
      is_deleted: order.is_deleted,
      items: order.order_items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
    });
  }

  async updateStatus(uuid: string, data: OrderStatusUpdateType): Promise<OrderResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = OrderStatusUpdateSchema.parse(data);
    const order = await OrderRepository.findById(uuid);
    if (!order) {
      throw new Error(MESSAGES.ORDER_NOT_FOUND);
    }

    const updatedOrder = await OrderRepository.updateStatus(uuid, parsedData);
    return OrderResponseSchema.parse(updatedOrder);
  }

  async delete(uuid: string): Promise<void> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.MANAGE_ORDERS);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const order = await OrderRepository.findById(uuid);
    if (!order) {
      throw new Error(MESSAGES.ORDER_NOT_FOUND);
    }

    await OrderRepository.delete(uuid);
  }
}

export default new OrderService();
