import { PrismaClient, type users } from 'prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';
import type { UserFilterType } from '~/libs/schemas/user.schema';
import { hashPassword } from '~/libs/utils/hashPassword.util';

const prisma = new PrismaClient();

const UserRepository = {
  findAll: async ({
    email,
    username,
    full_name,
    phone_number,
    sort_by_name,
    sort_by_date,
    limit = 10,
    offset = 0,
  }: UserFilterType) => {
    return prisma.users.findMany({
      where: {
        is_public: true,
        is_deleted: false,
        email: email ? { equals: email } : undefined,
        username: username ? { equals: username } : undefined,
        phone_number: phone_number ? { equals: phone_number } : undefined,
        full_name: full_name ? { contains: full_name } : undefined,
      },
      orderBy: [
        sort_by_name ? { full_name: sort_by_name } : {},
        sort_by_date ? { updated_at: sort_by_date === 'newest' ? 'desc' : 'asc' } : { updated_at: 'desc' },
      ],
      take: limit,
      skip: offset,
      include: {
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
      },
    });
  },

  findById: async (uuid: string) => {
    return prisma.users.findUnique({
      where: { uuid, is_deleted: false },
      include: {
        role: true,
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
        shops: {
          select: {
            name: true,
            uuid: true,
          },
        },
      },
    });
  },

  findByAttributes: async (attributes: Partial<users>, operator: 'AND' | 'OR' = 'AND') => {
    const whereClause: any = {
      is_deleted: false,
    };

    if (operator === 'OR') {
      whereClause.OR = Object.entries(attributes).map(([key, value]) => ({
        [key]: value,
      }));
    } else {
      Object.assign(whereClause, attributes);
    }

    return prisma.users.findFirst({
      where: whereClause,
      include: {
        role: true,
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
      },
    });
  },

  create: async (user: Partial<users>) => {
    const userData: any = {
      uuid: uuidv4(),
      username: user.username!,
      email: user.email!,
      full_name: user.full_name ?? null,
      phone_number: user.phone_number ?? null,
      role_id: user.role_id!,
      avatar: user.avatar,
      gender: user.gender,
      day_of_birth: user.day_of_birth,
      is_public: user.is_public ?? true,
      is_activated: user.is_activated ?? true,
      two_factor_enabled: user.two_factor_enabled ?? false,
      provider: user.provider || 'email',
      provider_id: user.provider_id,
      email_verified_at: user.email_verified_at,
      last_login: user.last_login,
    };

    // Only hash password for email provider
    if (user.provider === 'email' && user.password) {
      userData.password = hashPassword(user.password);
    }

    return prisma.users.create({
      data: userData,
      include: {
        role: true,
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
      },
    });
  },

  update: async (uuid: string, data: Partial<users>) => {
    const updateData: any = {
      username: data.username,
      full_name: data.full_name,
      phone_number: data.phone_number,
      avatar: data.avatar,
      day_of_birth: data.day_of_birth,
      gender: data.gender,
      is_public: data.is_public,
      is_activated: data.is_activated,
      role_id: data.role_id,
      two_factor_enabled: data.two_factor_enabled,
      email_verified_at: data.email_verified_at,
      last_login: data.last_login,
    };

    // Only hash password if provided and not empty
    if (data.password) {
      updateData.password = hashPassword(data.password);
    }

    return prisma.users.update({
      where: { uuid, is_deleted: false },
      data: updateData,
      include: {
        role: true,
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
      },
    });
  },

  // delete: async (uuid: string): Promise<{ id: number }> => {
  //   // Get the user id first
  //   const user = await prisma.users.findUnique({ where: { uuid } });

  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   const userId = user.id;

  //   // Soft delete user
  //   await prisma.users.update({
  //     where: { uuid },
  //     data: { is_deleted: true },
  //   });

  //   // Soft delete related records
  //   await prisma.addresses.deleteMany({
  //     where: { user_id: userId },
  //   });

  //   await prisma.cart_items.deleteMany({
  //     where: { user_id: userId },
  //   });

  //   await prisma.orders.updateMany({
  //     where: { user_id: userId },
  //     data: { status: 'CANCELLED' },
  //   });

  //   await prisma.reviews.updateMany({
  //     where: { user_id: userId },
  //     data: { comment: '[DELETED]' },
  //   });

  //   await prisma.conversations.updateMany({
  //     where: { user_id: userId },
  //     data: {
  //       title: '[DELETED USER]',
  //     },
  //   });

  //   return { id: userId };
  // },

  // xóa cứng user xóa các ràng buộc
  delete: async (uuid: string): Promise<{ id: number }> => {
    const user = await prisma.users.findUnique({ where: { uuid } });

    if (!user) {
      throw new Error('User not found');
    }

    const userId = user.id;

    // Lấy danh sách address_id của user
    const addresses = await prisma.addresses.findMany({
      where: { user_id: userId },
      select: { id: true },
    });
    const addressIds = addresses.map((addr) => addr.id);

    // Xóa dữ liệu liên quan dùng address_id (nếu có)
    await prisma.orders.deleteMany({
      where: { address_id: { in: addressIds } },
    });

    // Xóa các bản ghi liên quan dùng user_id
    await prisma.cart_items.deleteMany({ where: { user_id: userId } });

    await prisma.reviews.updateMany({
      where: { user_id: userId },
      data: { comment: '[DELETED]' },
    });

    await prisma.conversations.updateMany({
      where: { user_id: userId },
      data: { title: '[DELETED USER]' },
    });

    // Xóa addresses sau khi không còn liên kết
    await prisma.addresses.deleteMany({ where: { user_id: userId } });

    // Soft delete user
    await prisma.users.update({
      where: { uuid },
      data: { is_deleted: true },
    });

    return { id: userId };
  },

  count: async (): Promise<number> => {
    return prisma.users.count({ where: { is_deleted: false } });
  },

  // Find user by email and provider for unique constraint
  findByEmailAndProvider: async (email: string, provider: string) => {
    return prisma.users.findFirst({
      where: {
        email,
        provider,
        is_deleted: false,
      },
      include: {
        role: true,
        addresses: true,
        orders: true,
        cart_items: true,
        reviews: true,
        conversations: true,
      },
    });
  },
};

export default UserRepository;
