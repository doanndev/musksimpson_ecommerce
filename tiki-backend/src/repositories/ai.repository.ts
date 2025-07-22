import { PrismaClient } from 'prisma/generated/client';
import { MESSAGES } from '~/libs/constants/messages.constant';

const prisma = new PrismaClient();

const AIRepository = {
  getRecommendations: async (user_id: string) => {
    const user = await prisma.users.findUnique({
      where: { uuid: user_id, is_deleted: false },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    // Simple recommendation based on order history
    const orders = await prisma.orders.findMany({
      where: { user_id: user.id, is_deleted: false },
      include: { order_items: { include: { product: true } } },
    });

    const categoryIds = orders.flatMap((order) => order.order_items.map((item) => item.product.category_id as number));

    const recommendedProducts = await prisma.products.findMany({
      where: {
        is_deleted: false,
        category_id: { in: categoryIds },
        id: {
          notIn: orders.flatMap((order) => order.order_items.map((item) => item.product_id)),
        },
      },
      take: 10,
      include: { product_images: true },
    });

    return recommendedProducts;
  },

  getAnalytics: async () => {
    const topProducts = await prisma.products.findMany({
      where: { is_deleted: false },
      orderBy: { order_items: { _count: 'desc' } },
      take: 5,
      include: { order_items: true },
    });

    const salesByCategory = await prisma.categories.findMany({
      where: { is_deleted: false },
      include: {
        products: {
          include: {
            order_items: {
              include: { order: { select: { total_amount: true } } },
            },
          },
        },
      },
    });

    return { topProducts, salesByCategory };
  },
};

export default AIRepository;
