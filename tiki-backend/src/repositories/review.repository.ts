import { PaymentStatusEnum, PrismaClient, type reviews } from 'prisma/generated/client';
import type { ReviewCreateInputType, ReviewFilterType } from '~/libs/schemas/review.schema';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const ReviewRepository = {
  create: async (review: ReviewCreateInputType): Promise<reviews> => {
    const user = await prisma.users.findUnique({
      where: { uuid: review.user_id, is_deleted: false },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    const product = await prisma.products.findUnique({
      where: { uuid: review.product_id, is_deleted: false },
    });
    if (!product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);

    return prisma.reviews.create({
      data: {
        uuid: uuidv4(),
        user_id: user.id,
        product_id: product.id,
        rating: review.rating,
        comment: review.comment || null,
      },
    });
  },

  findAll: async (filters: ReviewFilterType): Promise<reviews[]> => {
    const { product_id, min_rating, max_rating, limit = 10, offset = 0 } = filters;
    let productId: number | undefined;
    if (product_id) {
      const product = await prisma.products.findUnique({
        where: { uuid: product_id, is_deleted: false },
      });
      if (!product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
      productId = product.id;
    }

    return prisma.reviews.findMany({
      where: {
        product_id: productId,
        rating: {
          gte: min_rating,
          lte: max_rating,
        },
        is_deleted: false,
      },
      take: limit,
      skip: offset,
      include: {
        user: { select: { id: true, uuid: true, username: true } },
        product: { select: { id: true, uuid: true, name: true } },
      },
    });
  },

  findById: async (uuid: string): Promise<reviews | null> => {
    return prisma.reviews.findUnique({
      where: { uuid, is_deleted: false },
      include: {
        user: { select: { id: true, uuid: true, username: true } },
        product: { select: { id: true, uuid: true, name: true } },
      },
    });
  },

  delete: async (uuid: string): Promise<void> => {
    await prisma.reviews.update({
      where: { uuid, is_deleted: false },
      data: { is_deleted: true, updated_at: new Date() },
    });
  },

  hasUserPurchased: async (user_uuid: string, product_uuid: string): Promise<boolean> => {
    const user = await prisma.users.findUnique({
      where: { uuid: user_uuid, is_deleted: false },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    const product = await prisma.products.findUnique({
      where: { uuid: product_uuid, is_deleted: false },
    });
    if (!product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);

    const order = await prisma.orders.findFirst({
      where: {
        user_id: user.id,
        is_deleted: false,
        order_items: {
          some: {
            product_id: product.id,
          },
        },
        payments: {
          some: {
            status: PaymentStatusEnum.COMPLETED,
          },
        },
      },
    });

    return !!order;
  },
};

export default ReviewRepository;
