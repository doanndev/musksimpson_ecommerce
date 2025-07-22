import { OrderStatusEnum, PrismaClient } from 'prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { OrderCreateInputType, OrderFilterType, OrderStatusUpdateType } from '~/libs/schemas/order.schema';
import ProductRepository from './product.repository';

const prisma = new PrismaClient();

const OrderRepository = {
  findAll: async (params: OrderFilterType) => {
    const { user_id, status, search, limit = 10, offset = 0, sort_by, sort_order } = params;

    const user = user_id
      ? await prisma.users.findUnique({
        where: { uuid: user_id, is_deleted: false },
      })
      : null;
    return prisma.orders.findMany({
      where: {
        is_deleted: false,
        user_id: user?.id,
        status: status ? (status as OrderStatusEnum) : undefined,
        OR: search
          ? [
            {
              uuid: { contains: search },
            },
            {
              order_items: {
                some: {
                  product: {
                    name: { contains: search },
                  },
                },
              },
            },
          ]
          : undefined,
      },
      take: limit,
      skip: offset,
      orderBy: sort_by ? { [sort_by]: sort_order } : { updated_at: 'desc' },
      include: {
        order_items: {
          include: {
            product: {
              include: {
                product_images: true,
              },
            },
          },
        },
        address: true,
        payments: true,
        user: true,
      },
    });
  },

  findById: async (uuid: string) => {
    return prisma.orders.findUnique({
      where: { uuid, is_deleted: false },
      include: {
        order_items: {
          include: {
            product: {
              include: {
                product_images: true,
              },
            },
          },
        },
        address: true,
        payments: true,
      },
    });
  },

  create: async (order: OrderCreateInputType) => {
    const user = await prisma.users.findUnique({
      where: { uuid: order.user_id, is_deleted: false },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    const address = await prisma.addresses.findUnique({
      where: { id: order.address_id, is_deleted: false },
    });
    if (!address) throw new Error(MESSAGES.ADDRESS_NOT_FOUND);

    return prisma.$transaction(
      async (tx) => {
        let total_amount = 0;
        const orderItems = [];
        const productUpdates: { id: number; quantity: number; }[] = [];

        // Validate products and prepare updates
        for (const item of order.items) {
          const product = await tx.products.findUnique({
            where: { uuid: item.product_id, is_deleted: false },
            select: { id: true, new_price: true, stock: true },
          });

          if (!product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
          if (product.stock < item.quantity) throw new Error(MESSAGES.INSUFFICIENT_STOCK);

          total_amount += product.new_price * item.quantity;
          orderItems.push({
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.new_price,
          });
          productUpdates.push({ id: product.id, quantity: item.quantity });
        }

        // Batch update product stock
        await Promise.all(
          productUpdates.map(({ id, quantity }) =>
            tx.products.update({
              where: { id },
              data: {
                stock: { decrement: quantity },
                updated_at: new Date(),
              },
            })
          )
        );

        // Create order
        return tx.orders.create({
          data: {
            uuid: uuidv4(),
            user_id: user.id,
            address_id: order.address_id,
            total_amount,
            status: OrderStatusEnum.PENDING,
            order_items: { create: orderItems },
          },
          include: {
            order_items: { include: { product: true } },
            address: true,
            payments: true,
          },
        });
      },
      {
        isolationLevel: 'Serializable',
        maxWait: 10000, // Wait up to 10 seconds for transaction to start
        timeout: 15000, // Allow up to 15 seconds for transaction to complete
      }
    );
  },

  updateStatus: async (uuid: string, data: OrderStatusUpdateType) => {
    return prisma.$transaction(
      async (tx) => {
        // Fetch only necessary order data
        const order = await tx.orders.findUnique({
          where: { uuid, is_deleted: false },
          select: {
            status: true,
            order_items: {
              select: {
                product_id: true,
                quantity: true,
              },
            },
          },
        });

        if (!order) throw new Error(MESSAGES.ORDER_NOT_FOUND);

        // Prepare product updates based on status change
        const productUpdates: { id: number; stockChange: number; soldChange: number; }[] = [];
        if (data.status === OrderStatusEnum.DELIVERED && order.status !== OrderStatusEnum.DELIVERED) {
          order.order_items.forEach((item) => {
            productUpdates.push({
              id: item.product_id,
              stockChange: 0,
              soldChange: item.quantity,
            });
          });
        } else if (data.status === OrderStatusEnum.CANCELLED && order.status !== OrderStatusEnum.CANCELLED) {
          order.order_items.forEach((item) => {
            productUpdates.push({
              id: item.product_id,
              stockChange: item.quantity,
              soldChange: 0,
            });
          });
        }

        // Batch update product stock and sold
        if (productUpdates.length > 0) {
          await Promise.all(
            productUpdates.map(({ id, stockChange, soldChange }) =>
              tx.products.update({
                where: { id, is_deleted: false },
                data: {
                  stock: { increment: stockChange },
                  sold: { increment: soldChange },
                  updated_at: new Date(),
                },
              })
            )
          );
        }

        // Update order status
        return tx.orders.update({
          where: { uuid, is_deleted: false },
          data: { status: data.status, updated_at: new Date() },
          include: {
            order_items: { include: { product: true } },
            address: true,
            payments: true,
          },
        });
      },
      {
        isolationLevel: 'ReadCommitted', // Less strict than Serializable
        maxWait: 15000, // Increase to 15 seconds to allow more time for lock acquisition
        timeout: 20000, // Increase to 20 seconds to allow transaction completion
      }
    );
  },

  delete: async (uuid: string): Promise<void> => {
    return prisma.$transaction(
      async (tx) => {
        const order = await tx.orders.findUnique({
          where: { uuid, is_deleted: false },
          include: { order_items: true },
        });

        if (!order) throw new Error(MESSAGES.ORDER_NOT_FOUND);

        if (order.status !== OrderStatusEnum.DELIVERED && order.status !== OrderStatusEnum.CANCELLED) {
          await Promise.all(
            order.order_items.map((item) => ProductRepository.updateStockAndSold(item.product_id, item.quantity, 0))
          );
        }

        await tx.orders.update({
          where: { uuid },
          data: { is_deleted: true, updated_at: new Date() },
        });
      },
      {
        isolationLevel: 'Serializable',
        maxWait: 10000,
        timeout: 15000,
      }
    );
  },

  count: async (params: OrderFilterType): Promise<number> => {
    const { user_id, status, search } = params;
    return prisma.orders.count({
      where: {
        is_deleted: false,
        user_id: user_id ? (await prisma.users.findUnique({ where: { uuid: user_id } }))?.id : undefined,
        status: status ? (status as OrderStatusEnum) : undefined,
        OR: search
          ? [
            { uuid: { contains: search } },
            {
              order_items: {
                some: {
                  product: {
                    name: { contains: search },
                  },
                },
              },
            },
          ]
          : undefined,
      },
    });
  },
};

export default OrderRepository;
