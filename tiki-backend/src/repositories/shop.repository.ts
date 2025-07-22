import { PrismaClient } from 'prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { ShopCreateInputType, ShopFilterType, ShopUpdateInputType } from '~/libs/schemas/shop.schema';
import { toSlug } from '~/libs/utils';

const prisma = new PrismaClient();

const ShopRepository = {
  findAll: async ({ name, seller_id, is_active, limit = 10, offset = 0, sort_by, sort_order }: ShopFilterType) => {
    return prisma.shops.findMany({
      where: {
        is_deleted: false,
        name: name ? { contains: name } : undefined,
        seller: seller_id ? { uuid: seller_id } : undefined,
        is_active: is_active !== undefined ? is_active : undefined,
      },
      take: limit,
      skip: offset,
      orderBy: sort_by ? { [sort_by]: sort_order } : { updated_at: 'desc' },
      include: {
        seller: true,
        address: true,
        products: {
          where: { is_deleted: false },
        },
      },
    });
  },

  findById: async (uuid: string) => {
    return prisma.shops.findUnique({
      where: { uuid, is_deleted: false },
      include: {
        seller: true,
        address: true,
        products: {
          where: { is_deleted: false },
        },
      },
    });
  },

  create: async (shop: ShopCreateInputType, sellerId: number) => {
    const address = shop.address_id
      ? await prisma.addresses.findUnique({
          where: { id: shop.address_id },
        })
      : null;
    if (shop.address_id && !address) throw new Error(MESSAGES.ADDRESS_NOT_FOUND);

    const newShop = await prisma.shops.create({
      data: {
        uuid: uuidv4(),
        seller_id: sellerId,
        name: shop.name,
        slug: toSlug(shop.name),
        description: shop.description || null,
        logo: shop.logo || null,
        address_id: address ? address.id : null,
        is_active: shop.is_active,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        seller: true,
        address: true,
        products: {
          where: { is_deleted: false },
        },
      },
    });

    return newShop;
  },

  update: async (uuid: string, data: ShopUpdateInputType) => {
    const { address_id, ...shopData } = data;
    const updates: any = { ...shopData };

    if (address_id) {
      const address = await prisma.addresses.findUnique({
        where: { id: address_id },
      });
      if (!address) throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
      updates.address_id = address.id;
    }

    return prisma.shops.update({
      where: { uuid, is_deleted: false },
      data: {
        ...updates,
        slug: shopData.name ? toSlug(shopData.name) : undefined,
        updated_at: new Date(),
      },
      include: {
        seller: true,
        address: true,
        products: {
          where: { is_deleted: false },
        },
      },
    });
  },

  delete: async (uuid: string): Promise<void> => {
    await prisma.shops.update({
      where: { uuid },
      data: { is_deleted: true },
    });
  },

  count: async (): Promise<number> => {
    return prisma.shops.count({
      where: { is_deleted: false },
    });
  },
};

export default ShopRepository;
