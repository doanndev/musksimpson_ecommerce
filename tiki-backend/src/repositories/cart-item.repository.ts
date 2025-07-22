import { PrismaClient } from 'prisma/generated/client';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { CartItemCreateInputType, CartItemUpdateInputType } from '~/libs/schemas/cart-item.schema';

const prisma = new PrismaClient();

const CartItemRepository = {
  findAllByUser: async (user_id: string) => {
    const user = await prisma.users.findUnique({
      where: { uuid: user_id, is_deleted: false },
      select: { id: true },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    return prisma.cart_items.findMany({
      where: { user_id: user.id },
      include: {
        product: {
          include: {
            product_images: {
              where: { is_primary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  },

  findById: async (id: number) => {
    return prisma.cart_items.findUnique({
      where: { id },
      include: { product: true },
    });
  },

  create: async (cartItem: CartItemCreateInputType) => {
    // First, validate user and product outside transaction
    const [user, product] = await Promise.all([
      prisma.users.findUnique({
        where: { uuid: cartItem.user_id, is_deleted: false },
        select: { id: true },
      }),
      prisma.products.findUnique({
        where: { uuid: cartItem.product_id, is_deleted: false },
        select: { id: true, stock: true, name: true, new_price: true },
      }),
    ]);

    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    if (!product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    if (product.stock < cartItem.quantity) {
      throw new Error(MESSAGES.INSUFFICIENT_STOCK);
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart_items.findFirst({
      where: {
        user_id: user.id,
        product_id: product.id,
      },
    });

    if (existingCartItem) {
      // Update existing item instead of creating new one
      const newQuantity = existingCartItem.quantity + cartItem.quantity;
      if (product.stock < newQuantity) {
        throw new Error(MESSAGES.INSUFFICIENT_STOCK);
      }

      return prisma.$transaction(
        async (tx) => {
          // Update stock
          await tx.products.update({
            where: { id: product.id },
            data: {
              stock: { decrement: cartItem.quantity },
            },
          });

          // Update cart item
          return tx.cart_items.update({
            where: { id: existingCartItem.id },
            data: {
              quantity: newQuantity,
              updated_at: new Date(),
            },
            include: { product: true },
          });
        },
        {
          timeout: 10000, // 10 seconds timeout
          isolationLevel: 'ReadCommitted', // Less restrictive than Serializable
        }
      );
    }

    // Create new cart item
    return prisma.$transaction(
      async (tx) => {
        // Update stock first
        await tx.products.update({
          where: { id: product.id },
          data: {
            stock: { decrement: cartItem.quantity },
          },
        });

        // Create cart item
        return tx.cart_items.create({
          data: {
            user_id: user.id,
            product_id: product.id,
            quantity: cartItem.quantity,
          },
          include: { product: true },
        });
      },
      {
        timeout: 10000, // 10 seconds timeout
        isolationLevel: 'ReadCommitted',
      }
    );
  },

  update: async (id: number, data: CartItemUpdateInputType) => {
    // Get cart item and product info first
    const cartItem = await prisma.cart_items.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, stock: true, name: true, new_price: true }, // Added new_price
        },
      },
    });

    if (!cartItem) throw new Error(MESSAGES.CART_ITEM_NOT_FOUND);
    if (!cartItem.product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);

    const stockChange = data.quantity - cartItem.quantity;
    const currentAvailableStock = cartItem.product.stock + cartItem.quantity;

    if (data.quantity > currentAvailableStock) {
      throw new Error(MESSAGES.INSUFFICIENT_STOCK);
    }

    return prisma.$transaction(
      async (tx) => {
        // Update product stock
        if (stockChange !== 0) {
          await tx.products.update({
            where: { id: cartItem.product_id },
            data: {
              stock: { increment: -stockChange },
            },
          });
        }

        // Update cart item
        return tx.cart_items.update({
          where: { id },
          data: {
            quantity: data.quantity,
            updated_at: new Date(),
          },
          include: { product: true },
        });
      },
      {
        timeout: 10000,
        isolationLevel: 'ReadCommitted',
      }
    );
  },

  delete: async (id: number): Promise<void> => {
    const cartItem = await prisma.cart_items.findUnique({
      where: { id },
      select: {
        id: true,
        product_id: true,
        quantity: true,
      },
    });

    if (!cartItem) throw new Error(MESSAGES.CART_ITEM_NOT_FOUND);

    await prisma.$transaction(
      async (tx) => {
        // Return stock to product
        await tx.products.update({
          where: { id: cartItem.product_id },
          data: {
            stock: { increment: cartItem.quantity },
          },
        });

        // Delete cart item
        await tx.cart_items.delete({
          where: { id },
        });
      },
      {
        timeout: 10000,
        isolationLevel: 'ReadCommitted',
      }
    );
  },

  clearUserCart: async (user_id: string): Promise<void> => {
    const user = await prisma.users.findUnique({
      where: { uuid: user_id, is_deleted: false },
      select: { id: true },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    const cartItems = await prisma.cart_items.findMany({
      where: { user_id: user.id },
      select: { id: true, product_id: true, quantity: true },
    });

    if (cartItems.length === 0) return;

    await prisma.$transaction(
      async (tx) => {
        // Return stock for all items
        for (const item of cartItems) {
          await tx.products.update({
            where: { id: item.product_id },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }

        // Delete all cart items for user
        await tx.cart_items.deleteMany({
          where: { user_id: user.id },
        });
      },
      {
        timeout: 15000, // Longer timeout for bulk operations
        isolationLevel: 'ReadCommitted',
      }
    );
  },

  getCartSummary: async (user_id: string) => {
    const user = await prisma.users.findUnique({
      where: { uuid: user_id, is_deleted: false },
      select: { id: true },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    const result = await prisma.cart_items.aggregate({
      where: { user_id: user.id },
      _sum: { quantity: true },
      _count: { id: true },
    });

    const cartItems = await prisma.cart_items.findMany({
      where: { user_id: user.id },
      include: {
        product: {
          select: { new_price: true }, // Changed price to new_price
        },
      },
    });

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.product.new_price * item.quantity; // Use new_price
    }, 0);

    return {
      totalItems: result._count.id || 0,
      totalQuantity: result._sum.quantity || 0,
      totalAmount,
    };
  },
};

export default CartItemRepository;
