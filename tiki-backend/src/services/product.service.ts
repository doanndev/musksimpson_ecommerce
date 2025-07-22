import dayjs from 'dayjs';
import { PermissionEnum, type categories } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AddressResponseType } from '~/libs/schemas/address.schema';
import {
    ProductCreateInputSchema,
    type ProductCreateInputType,
    ProductFilterSchema,
    type ProductFilterType,
    ProductResponseSchema,
    type ProductResponseType,
    ProductUpdateInputSchema,
    type ProductUpdateInputType,
} from '~/libs/schemas/product.schema';
import type { IPagination } from '~/libs/types/common.types';
import { ServiceType, calculateShipping } from '~/libs/utils/calculateShipping.util';
import { getInfoFromIP } from '~/libs/utils/getInfoFromIP.util';
import { getRequestIP, getRequestUser } from '~/libs/utils/requestContext.util';
import ProductRepository from '../repositories/product.repository';
import userService from './user.service';

interface ShippingLocation {
    provinceName: string;
    wardName?: string;
    regionId: number;
}

class ProductService {
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

    async getCategoryHierarchy(categoryId: number): Promise<categories[]> {
        const hierarchy: categories[] = [];

        async function fetchParent(currentId: number): Promise<void> {
            const category = await prisma.categories.findUnique({
                where: { id: currentId, is_deleted: false },
                include: {
                    parent: true,
                },
            });

            if (!category) {
                throw new Error(`Category with ID ${currentId} not found`);
            }

            hierarchy.push(category);

            if (category.parent_id) {
                await fetchParent(category.parent_id);
            }
        }

        await fetchParent(categoryId);

        return hierarchy.reverse();
    }

    // Optimized method to get user shipping location (cached approach)
    private async getUserShippingLocation(): Promise<ShippingLocation> {
        try {
            // Try to get current user first
            const userCurrent = await userService.getUserCurrent();
            const defaultAddress = userCurrent?.addresses?.find((address: AddressResponseType) => address.is_default);

            if (defaultAddress && defaultAddress.province_name && defaultAddress.region_id) {
                return {
                    provinceName: defaultAddress.province_name,
                    wardName: defaultAddress.ward_name || undefined,
                    regionId: defaultAddress.region_id,
                };
            }
        } catch (error) {
            console.log('Failed to get user address, falling back to IP location');
        }

        // Fallback to IP-based location
        const userIP = getRequestIP();
        const userLocation = await getInfoFromIP(userIP);

        return {
            provinceName: userLocation.provinceName,
            wardName: userLocation.address?.quarter,
            regionId: userLocation.regionId,
        };
    }

    // Optimized method to calculate shipping with location caching
    private async calculateProductShipping(
        product: any,
        userLocation: ShippingLocation
    ): Promise<{ fee: number | null; estimated_delivery_date: string | null; }> {
        if (!product.shop?.address?.province_name || !product.shop?.address?.region_id) {
            return { fee: null, estimated_delivery_date: null };
        }

        try {
            const { shippingFee, estimatedDeliveryDays } = await calculateShipping({
                weight: product.weight ?? 0,
                shopProvince: product.shop.address.province_name,
                userProvince: userLocation.provinceName,
                userWard: userLocation.wardName,
                shopRegionId: product.shop.address.region_id,
                userRegionId: userLocation.regionId,
                serviceType: ServiceType.STANDARD,
            });

            return {
                fee: shippingFee,
                estimated_delivery_date: dayjs().add(estimatedDeliveryDays, 'day').toISOString(),
            };
        } catch (error) {
            console.error('Shipping calculation error:', error);
            return { fee: null, estimated_delivery_date: null };
        }
    }

    async getAll(query: ProductFilterType): Promise<IPagination<ProductResponseType>> {
        const parsedQuery = ProductFilterSchema.parse(query);
        const products = await ProductRepository.findAll(parsedQuery);
        const totalItem = await ProductRepository.count(parsedQuery);
        const limit = parsedQuery.limit || 10;
        const totalPage = Math.ceil(totalItem / limit);

        const meta = {
            page: Math.floor((parsedQuery.offset || 0) / limit) + 1,
            limit,
            totalPage,
            totalItem,
        };

        // Get user location once for all products
        const userLocation = await this.getUserShippingLocation();

        const transformedProducts = await Promise.all(
            products.map(async (product) => {
                const { fee, estimated_delivery_date } = await this.calculateProductShipping(product, userLocation);

                return ProductResponseSchema.parse({
                    uuid: product.uuid,
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    old_price: product.old_price,
                    new_price: product.new_price,
                    discount_percentage: product.discount_percentage,
                    stock: product.stock,
                    sold: product.sold,
                    category_id: product.category?.uuid,
                    shop: product.shop,
                    is_deleted: product.is_deleted,
                    images: product.product_images,
                    specifications: product.product_specifications?.map((spec) => ({
                        key: spec.key,
                        value: spec.value,
                        attributes: spec.product_attributes,
                    })),
                    reviews: product.reviews,
                    average_rating: product?.reviews?.length
                        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                        : 0,
                    created_at: product.created_at,
                    updated_at: product.updated_at,
                    fee,
                    estimated_delivery_date,
                });
            })
        );

        return { items: transformedProducts, meta };
    }

    async getById(uuid: string): Promise<ProductResponseType> {
        const product = await ProductRepository.findById(uuid);

        if (!product) {
            throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
        }

        let categoryHierarchy: categories[] = [];
        if (product.category_id) {
            categoryHierarchy = await this.getCategoryHierarchy(product.category_id);
        }

        // Get user location once
        const userLocation = await this.getUserShippingLocation();
        const { fee, estimated_delivery_date } = await this.calculateProductShipping(product, userLocation);

        return ProductResponseSchema.parse({
            uuid: product.uuid,
            name: product.name,
            slug: product.slug,
            description: product.description,
            old_price: product.old_price,
            new_price: product.new_price,
            discount_percentage: product.discount_percentage,
            stock: product.stock,
            sold: product.sold,
            category_id: product.category?.uuid,
            shop: product.shop,
            is_deleted: product.is_deleted,
            images: product.product_images,
            specifications: product.product_specifications?.map((spec) => ({
                key: spec.key,
                value: spec.value,
                attributes: spec.product_attributes,
            })),
            breadcrumbs: categoryHierarchy,
            reviews: product.reviews,
            average_rating: product?.reviews?.length
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0,
            created_at: product.created_at,
            updated_at: product.updated_at,
            fee,
            estimated_delivery_date,
        });
    }

    async calculateShippingFee(uuids: string[]): Promise<ProductResponseType[]> {
        const products = await ProductRepository.findManyByIds(uuids);

        // Get user location once for all products
        const userLocation = await this.getUserShippingLocation();
        console.log({ userLocation });
        const results: ProductResponseType[] = [];

        for (const product of products) {
            if (!product) continue;

            let categoryHierarchy: categories[] = [];
            let uuidCategory = '';

            if (product.category_id) {
                categoryHierarchy = await this.getCategoryHierarchy(product.category_id);
                const category = await prisma.categories.findUnique({
                    where: { id: product.category_id },
                    select: { uuid: true },
                });

                if (category) {
                    uuidCategory = category.uuid;
                }
            }

            const { fee, estimated_delivery_date } = await this.calculateProductShipping(product, userLocation);


            const productResponse = ProductResponseSchema.parse({
                uuid: product.uuid,
                name: product.name,
                slug: product.slug,
                description: product.description,
                old_price: product.old_price,
                new_price: product.new_price,
                discount_percentage: product.discount_percentage,
                stock: product.stock,
                sold: product.sold,
                category_id: uuidCategory,
                shop: product.shop,
                is_deleted: product.is_deleted,
                images: product.product_images,
                specifications: product.product_specifications?.map((spec) => ({
                    key: spec.key,
                    value: spec.value,
                    attributes: spec.product_attributes,
                })),
                breadcrumbs: categoryHierarchy,
                reviews: product.reviews,
                average_rating: product.reviews?.length
                    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                    : 0,
                created_at: product.created_at,
                updated_at: product.updated_at,
                fee,
                estimated_delivery_date,
            });

            results.push(productResponse);
        }

        return results;
    }

    async create(data: ProductCreateInputType): Promise<ProductResponseType> {
        const reqUser = getRequestUser();
        if (!reqUser?.userId) {
            throw new Error(MESSAGES.NOT_LOGGED_IN);
        }

        const hasPermission = await this.checkPermission(reqUser.userId, [
            PermissionEnum.MANAGE_PRODUCTS,
            PermissionEnum.CREATE_SHOP,
        ]);
        if (!hasPermission) {
            throw new Error(MESSAGES.FORBIDDEN);
        }

        const shop = await prisma.shops.findUnique({
            where: { uuid: data.shop_id },
        });
        if (!shop) {
            throw new Error(MESSAGES.SHOP_NOT_FOUND);
        }
        if (shop.seller_id !== (await prisma.users.findUnique({ where: { uuid: reqUser.userId } }))?.id) {
            throw new Error(MESSAGES.FORBIDDEN);
        }

        const parsedData = ProductCreateInputSchema.parse(data);
        const product = await ProductRepository.create(parsedData);
        return ProductResponseSchema.parse({
            ...product,
            shop: product?.shop,
            fee: null,
            estimated_delivery_date: null,
        });
    }

    async update(uuid: string, data: ProductUpdateInputType): Promise<ProductResponseType> {
        const reqUser = getRequestUser();
        if (!reqUser?.userId) {
            throw new Error(MESSAGES.NOT_LOGGED_IN);
        }

        const hasPermission = await this.checkPermission(reqUser.userId, [
            PermissionEnum.MANAGE_PRODUCTS,
            PermissionEnum.EDIT_SHOP,
        ]);
        if (!hasPermission) {
            throw new Error(MESSAGES.FORBIDDEN);
        }

        const product = await ProductRepository.findById(uuid);
        if (!product) {
            throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
        }

        if (data.shop_id) {
            const shop = await prisma.shops.findUnique({
                where: { uuid: data.shop_id },
            });
            if (!shop) {
                throw new Error(MESSAGES.SHOP_NOT_FOUND);
            }
            if (shop.seller_id !== (await prisma.users.findUnique({ where: { uuid: reqUser.userId } }))?.id) {
                throw new Error(MESSAGES.FORBIDDEN);
            }
        }

        const parsedData = ProductUpdateInputSchema.parse(data);
        const updatedProduct = await ProductRepository.update(uuid, parsedData);
        return ProductResponseSchema.parse({
            ...updatedProduct,
            shop: updatedProduct.shop,
            fee: null,
            estimated_delivery_date: null,
        });
    }

    async delete(uuid: string): Promise<ProductResponseType> {
        const reqUser = getRequestUser();
        if (!reqUser?.userId) {
            throw new Error(MESSAGES.NOT_LOGGED_IN);
        }

        const hasPermission = await this.checkPermission(reqUser.userId, [
            PermissionEnum.MANAGE_PRODUCTS,
            PermissionEnum.DELETE_SHOP,
        ]);
        if (!hasPermission) {
            throw new Error(MESSAGES.FORBIDDEN);
        }

        const product = await ProductRepository.findById(uuid);
        if (!product) {
            throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
        }

        if (product.shop_id) {
            const shop = await prisma.shops.findUnique({
                where: { id: product.shop_id },
            });
            if (!shop) {
                throw new Error(MESSAGES.SHOP_NOT_FOUND);
            }
            if (shop.seller_id !== (await prisma.users.findUnique({ where: { uuid: reqUser.userId } }))?.id) {
                throw new Error(MESSAGES.FORBIDDEN);
            }
        }

        await ProductRepository.delete(uuid);
        return ProductResponseSchema.parse({
            ...product,
            shop: product.shop,
            fee: null,
            estimated_delivery_date: null,
        });
    }
}

export default new ProductService();
