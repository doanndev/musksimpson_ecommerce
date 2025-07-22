import { PaymentStatusEnum, PrismaClient, type payments } from 'prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES } from '~/libs/constants/messages.constant';
// PaymentRepository.ts
import type { PaymentCreateInputType } from '~/libs/schemas/payment.schema';

const prisma = new PrismaClient();

const PaymentRepository = {
  create: async (payment: PaymentCreateInputType & { items: any[]; transaction_id: string }): Promise<payments> => {
    const user = await prisma.users.findUnique({
      where: { uuid: payment.user_id, is_deleted: false },
    });
    if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

    return prisma.payments.create({
      data: {
        uuid: uuidv4(),
        user_id: user.id,
        amount: payment.amount,
        provider: 'PayPal',
        status: PaymentStatusEnum.PENDING,
        items: payment.items, // Store items temporarily
        transaction_id: payment.transaction_id,
      },
    });
  },

  updateStatus: async (
    uuid: string,
    status: PaymentStatusEnum,
    transaction_id?: string,
    order_id?: number
  ): Promise<payments> => {
    return prisma.payments.update({
      where: { uuid, is_deleted: false },
      data: {
        status,
        transaction_id,
        order_id,
      },
    });
  },

  findByPayPalOrderId: async (paypal_order_id: string): Promise<payments | null> => {
    return prisma.payments.findFirst({
      where: { transaction_id: paypal_order_id, is_deleted: false },
    });
  },

  findByOrderId: async (order_id: string): Promise<payments | null> => {
    const order = await prisma.orders.findUnique({
      where: { uuid: order_id, is_deleted: false },
    });
    if (!order) throw new Error(MESSAGES.ORDER_NOT_FOUND);

    return prisma.payments.findFirst({
      where: { order_id: order.id, is_deleted: false },
    });
  },

  findByTransactionId: async (transaction_id: string): Promise<payments | null> => {
    return prisma.payments.findFirst({
      where: { transaction_id, is_deleted: false },
    });
  },
};

export default PaymentRepository;
