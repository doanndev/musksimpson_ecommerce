import { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import {
  ShopCreateInputSchema,
  type ShopCreateInputType,
  ShopFilterSchema,
  type ShopFilterType,
  ShopResponseSchema,
  type ShopResponseType,
  ShopUpdateInputSchema,
  type ShopUpdateInputType,
} from '~/libs/schemas/shop.schema';
import type { IPagination } from '~/libs/types/common.types';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import ShopRepository from '../repositories/shop.repository';

class ShopService {
  private async checkPermission(userId: string, permissions: PermissionEnum[]): Promise<boolean> {
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

    return permissions.some((permission) => user.role.role_permissions.some((rp) => rp.permission.name === permission));
  }

  async getAll(query: ShopFilterType): Promise<IPagination<ShopResponseType>> {
    const parsedQuery = ShopFilterSchema.parse(query);
    const shops = await ShopRepository.findAll(parsedQuery);
    const totalItem = await ShopRepository.count();
    const limit = parsedQuery.limit || 10;
    const totalPage = Math.ceil(totalItem / limit);

    const meta = {
      page: Math.floor((parsedQuery.offset || 0) / limit) + 1,
      limit,
      totalPage,
      totalItem,
    };

    const transformedShops = shops.map((shop) =>
      ShopResponseSchema.parse({
        uuid: shop.uuid,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        logo: shop.logo,
        rating: shop.rating,
        address_id: shop.address_id,
        is_active: shop.is_active,
        products: shop.products.length,
        stock: shop.products.reduce((total, product) => total + product.stock, 0),
        purchases: shop.products.reduce((total, product) => total + product.sold, 0),
        address: shop.address,
        is_deleted: shop.is_deleted,
        created_at: shop.created_at,
        updated_at: shop.updated_at,
      })
    );

    return { items: transformedShops, meta };
  }

  async getById(uuid: string): Promise<ShopResponseType> {
    const shop = await ShopRepository.findById(uuid);
    console.log({ shop });
    if (!shop) {
      throw new Error(MESSAGES.SHOP_NOT_FOUND);
    }
    return ShopResponseSchema.parse({
      uuid: shop.uuid,
      name: shop.name,
      slug: shop.slug,
      description: shop.description,
      logo: shop.logo,
      rating: shop.rating,
      address_id: shop.address_id,
      products: shop.products.length,
      stock: shop.products.reduce((total, product) => total + product.stock, 0),
      purchases: shop.products.reduce((total, product) => total + product.sold, 0),
      address: shop.address,
      is_active: shop.is_active,
      is_deleted: shop.is_deleted,
      created_at: shop.created_at,
      updated_at: shop.updated_at,
    });
  }

  async create(data: ShopCreateInputType): Promise<ShopResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, [PermissionEnum.CREATE_SHOP]);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const user = await prisma.users.findUnique({
      where: { uuid: reqUser.userId, is_deleted: false },
    });
    if (!user || user.role_id !== (await prisma.roles.findUnique({ where: { name: 'SELLER' } }))?.id) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = ShopCreateInputSchema.parse(data);
    const shop = await ShopRepository.create(parsedData, user.id);
    return ShopResponseSchema.parse({
      uuid: shop.uuid,
      name: shop.name,
      slug: shop.slug,
      description: shop.description,
      logo: shop.logo,
      rating: shop.rating,
      address_id: shop.address_id,
      is_active: shop.is_active,
      is_deleted: shop.is_deleted,
      created_at: shop.created_at,
      updated_at: shop.updated_at,
    });
  }

  async update(uuid: string, data: ShopUpdateInputType): Promise<ShopResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, [PermissionEnum.EDIT_SHOP]);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const shop = await ShopRepository.findById(uuid);
    if (!shop) {
      throw new Error(MESSAGES.SHOP_NOT_FOUND);
    }

    const user = await prisma.users.findUnique({
      where: { uuid: reqUser.userId, is_deleted: false },
    });
    if (
      !user ||
      (shop.seller_id !== user.id && user.role_id !== (await prisma.roles.findUnique({ where: { name: 'ADMIN' } }))?.id)
    ) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const parsedData = ShopUpdateInputSchema.parse(data);
    const updatedShop = await ShopRepository.update(uuid, parsedData);
    return ShopResponseSchema.parse({
      uuid: updatedShop.uuid,
      name: updatedShop.name,
      slug: updatedShop.slug,
      description: updatedShop.description,
      logo: updatedShop.logo,
      rating: updatedShop.rating,
      address_id: updatedShop.address_id,
      is_active: updatedShop.is_active,
      is_deleted: updatedShop.is_deleted,
      created_at: updatedShop.created_at,
      updated_at: updatedShop.updated_at,
    });
  }

  async delete(uuid: string): Promise<ShopResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, [PermissionEnum.DELETE_SHOP]);
    if (!hasPermission) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const shop = await ShopRepository.findById(uuid);
    if (!shop) {
      throw new Error(MESSAGES.SHOP_NOT_FOUND);
    }

    const user = await prisma.users.findUnique({
      where: { uuid: reqUser.userId, is_deleted: false },
    });
    if (
      !user ||
      (shop.seller_id !== user.id && user.role_id !== (await prisma.roles.findUnique({ where: { name: 'ADMIN' } }))?.id)
    ) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    await ShopRepository.delete(uuid);
    return ShopResponseSchema.parse({
      uuid: shop.uuid,
      name: shop.name,
      slug: shop.slug,
      description: shop.description,
      logo: shop.logo,
      rating: shop.rating,
      address_id: shop.address_id,
      is_active: shop.is_active,
      is_deleted: shop.is_deleted,
      created_at: shop.created_at,
      updated_at: shop.updated_at,
    });
  }
}

export default new ShopService();
