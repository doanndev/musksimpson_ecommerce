import { PrismaClient } from 'prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { ProductCreateInputType, ProductFilterType, ProductUpdateInputType } from '~/libs/schemas/product.schema';
import { toSlug } from '~/libs/utils';

const prisma = new PrismaClient();

const ProductRepository = {
    findAll: async ({
        name,
        category_id,
        min_price,
        max_price,
        sort_order,
        sort_by,
        limit = 10,
        offset = 0,
        shop_id,
    }: ProductFilterType) => {
        const sortBy: string = sort_by === 'price' ? 'new_price' : sort_by || 'updated_at';
        return prisma.products.findMany({
            where: {
                is_deleted: false,
                shop: shop_id ? { uuid: shop_id } : undefined,
                name: name ? { contains: name } : undefined,
                category: category_id ? { uuid: category_id } : undefined,
                new_price: {
                    gte: min_price,
                    lte: max_price,
                },
                stock: { gt: 0 },
            },
            orderBy: { [sortBy]: 'desc' },
            take: limit,
            skip: offset,
            include: {
                product_images: true,
                product_specifications: {
                    include: {
                        product_attributes: true,
                    },
                },
                category: {
                    include: {
                        children: true,
                    },
                },
                reviews: true,
                shop: {
                    include: {
                        address: true,
                    },
                },
            },
        });
    },

    findById: async (uuid: string) => {
        console.log({ uuid });
        return prisma.products.findUnique({
            where: { uuid, is_deleted: false },
            include: {
                product_images: true,
                product_specifications: {
                    include: {
                        product_attributes: true,
                    },
                },
                category: true,
                shop: {
                    include: {
                        address: true,
                    },
                },
                reviews: true,
            },
        });
    },

    async findManyByIds(uuids: string[]) {
        return prisma.products.findMany({
            where: {
                uuid: { in: uuids },
            },
            include: {
                product_images: true,
                product_specifications: {
                    include: { product_attributes: true },
                },
                reviews: true,
                shop: {
                    include: {
                        address: true,
                    },
                },
            },
        });
    },

    create: async (product: ProductCreateInputType) => {
        const category = await prisma.categories.findUnique({
            where: { uuid: product.category_id },
        });
        if (!category) throw new Error(MESSAGES.CATEGORY_NOT_FOUND);

        const shop = await prisma.shops.findUnique({
            where: { uuid: product.shop_id },
        });
        if (!shop) throw new Error(MESSAGES.SHOP_NOT_FOUND);

        const discount_percentage =
            product.old_price && product.new_price
                ? ((product.old_price - product.new_price) / product.old_price) * 100
                : null;

        const newProduct = await prisma.products.create({
            data: {
                uuid: uuidv4(),
                name: product.name,
                slug: toSlug(product.name),
                description: product.description,
                old_price: product.old_price,
                new_price: product.new_price,
                discount_percentage,
                stock: product.stock,
                sold: 0,
                category_id: category.id,
                shop_id: shop.id,
            },
            include: {
                product_images: true,
                product_specifications: {
                    include: {
                        product_attributes: true,
                    },
                },
                category: true,
                shop: true,
            },
        });

        if (product.images && product.images.length > 0) {
            await prisma.product_images.createMany({
                data: product.images.map((image) => ({
                    product_id: newProduct.id,
                    url: image.url,
                    is_primary: image.is_primary || false,
                    created_at: new Date(),
                    updated_at: new Date(),
                })),
            });
        }

        if (product.specifications && product.specifications.length > 0) {
            for (const spec of product.specifications) {
                const newSpec = await prisma.product_specifications.create({
                    data: {
                        product_id: newProduct.id,
                        key: spec.key,
                        value: spec.value || '',
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                if (spec.attributes && spec.attributes.length > 0) {
                    await prisma.product_attributes.createMany({
                        data: spec.attributes.map((attr) => ({
                            product_id: newProduct.id,
                            specification_id: newSpec.id,
                            name: attr.name,
                            value: attr.value,
                            created_at: new Date(),
                            updated_at: new Date(),
                        })),
                    });
                }
            }
        }

        return prisma.products.findUnique({
            where: { uuid: newProduct.uuid },
            include: {
                product_images: true,
                product_specifications: {
                    include: {
                        product_attributes: true,
                    },
                },
                category: true,
                shop: true,
                reviews: true,
            },
        });
    },

    update: async (uuid: string, data: ProductUpdateInputType) => {
        const { images, specifications, category_id, shop_id, ...productData } = data;
        const updates: any = { ...productData };

        if (category_id) {
            const category = await prisma.categories.findUnique({
                where: { uuid: category_id },
            });
            if (!category) throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
            updates.category_id = category.id;
        }

        if (shop_id) {
            const shop = await prisma.shops.findUnique({
                where: { uuid: shop_id },
            });
            if (!shop) throw new Error(MESSAGES.SHOP_NOT_FOUND);
            updates.shop_id = shop.id;
        }

        if (data.old_price && data.new_price) {
            updates.discount_percentage = ((data.old_price - data.new_price) / data.old_price) * 100;
        } else if (data.old_price || data.new_price) {
            const existingProduct = await prisma.products.findUnique({
                where: { uuid, is_deleted: false },
            });
            if (existingProduct) {
                const oldPrice = data.old_price ?? existingProduct.old_price;
                const newPrice = data.new_price ?? existingProduct.new_price;
                if (oldPrice && newPrice) {
                    updates.discount_percentage = ((oldPrice - newPrice) / oldPrice) * 100;
                } else {
                    updates.discount_percentage = null;
                }
            }
        }

        return prisma.products.update({
            where: { uuid, is_deleted: false },
            data: {
                ...updates,
                slug: productData.name ? toSlug(productData.name) : undefined,
                product_images: images
                    ? {
                        deleteMany: {},
                        create: images,
                    }
                    : undefined,
                product_specifications: specifications
                    ? {
                        deleteMany: {},
                        create: specifications.map((spec) => ({
                            key: spec.key,
                            value: spec.value || '',
                            product_attributes: {
                                create:
                                    spec.attributes?.map((attr) => ({
                                        name: attr.name,
                                        value: attr.value,
                                        created_at: new Date(),
                                        updated_at: new Date(),
                                    })) || [],
                            },
                            created_at: new Date(),
                            updated_at: new Date(),
                        })),
                    }
                    : undefined,
            },
            include: {
                product_images: true,
                product_specifications: {
                    include: {
                        product_attributes: true,
                    },
                },
                category: true,
                shop: true,
                reviews: true,
            },
        });
    },

    delete: async (uuid: string): Promise<void> => {
        await prisma.products.update({
            where: { uuid },
            data: { is_deleted: true },
        });
    },

    count: async ({ name, category_id, min_price, max_price, sort_by, shop_id }: ProductFilterType): Promise<number> => {
        const sortBy: string = sort_by === 'price' ? 'new_price' : sort_by || 'updated_at';
        return prisma.products.count({
            where: {
                is_deleted: false,
                stock: { gt: 0 },
                name: name ? { contains: name } : undefined,
                category: category_id ? { uuid: category_id } : undefined,
                shop: shop_id ? { uuid: shop_id } : undefined,
                new_price: {
                    gte: min_price,
                    lte: max_price,
                },
            },
            orderBy: { [sortBy]: 'desc' },
        });
    },

    updateStockAndSold: async (productId: number, stockChange: number, soldChange: number): Promise<void> => {
        console.log(`Updating stock for product ID ${productId}: stockChange=${stockChange}, soldChange=${soldChange}`);
        const product = await prisma.products.findUnique({
            where: { id: productId, is_deleted: false },
        });
        if (!product) throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
        if (product.stock + stockChange < 0) throw new Error(MESSAGES.INSUFFICIENT_STOCK);

        await prisma.products.update({
            where: { id: productId },
            data: {
                stock: { increment: stockChange },
                sold: { increment: soldChange },
                updated_at: new Date(),
            },
        });
        console.log(`Stock updated for product ID ${productId}`);
    },
};

export default ProductRepository;
