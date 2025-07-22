import { PrismaClient, type categories } from 'prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';
import type { CategoryCreateInputType, CategoryUpdateInputType } from '~/libs/schemas/category.schema';
import { toSlug } from '~/libs/utils';

const prisma = new PrismaClient();

const CategoryRepository = {
  findAll: async (limit = 10, offset = 0): Promise<categories[]> => {
    return prisma.categories.findMany({
      where: { is_deleted: false },
      take: limit,
      skip: offset,
      include: {
        category_breadcrumbs: true,
        parent: true,
        children: true,
      },
    });
  },

  findById: async (uuid: string): Promise<categories | null> => {
    return prisma.categories.findUnique({
      where: { uuid, is_deleted: false },
      include: {
        category_breadcrumbs: true,
        parent: true,
        children: true,
      },
    });
  },

  create: async (category: CategoryCreateInputType): Promise<categories> => {
    const parent = category.parent_id
      ? await prisma.categories.findUnique({
          where: { uuid: category.parent_id },
        })
      : null;
    return prisma.categories.create({
      data: {
        uuid: uuidv4(),
        name: category.name,
        icon: category.icon,
        slug: toSlug(category.name),
        parent_id: parent?.id,
        category_breadcrumbs: {
          create: category.breadcrumbs,
        },
      },
      include: {
        category_breadcrumbs: true,
        parent: true,
        children: true,
      },
    });
  },

  update: async (uuid: string, data: CategoryUpdateInputType): Promise<categories> => {
    const { breadcrumbs, parent_id, ...categoryData } = data;
    const updates: any = { ...categoryData };

    if (parent_id) {
      const parent = await prisma.categories.findUnique({
        where: { uuid: parent_id },
      });
      updates.parent_id = parent?.id || null;
    }

    return prisma.categories.update({
      where: { uuid, is_deleted: false },
      data: {
        ...updates,
        category_breadcrumbs: breadcrumbs
          ? {
              deleteMany: {},
              create: breadcrumbs,
            }
          : undefined,
      },
      include: {
        category_breadcrumbs: true,
        parent: true,
        children: true,
      },
    });
  },

  delete: async (uuid: string): Promise<void> => {
    await prisma.categories.update({
      where: { uuid },
      data: { is_deleted: true },
    });
  },
};

export default CategoryRepository;
