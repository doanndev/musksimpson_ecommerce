import ReviewRepository from '../repositories/review.repository';
import {
  ReviewCreateInputSchema,
  ReviewResponseSchema,
  ReviewFilterSchema,
  type ReviewFilterType,
  type ReviewResponseType,
} from '~/libs/schemas/review.schema';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import { PermissionEnum } from 'prisma/generated/client';
import { prisma } from '~/configs/database.config';
import UserRepository from '~/repositories/user.repository';

class ReviewService {
  private async checkPermission(userId: string, permission: PermissionEnum): Promise<boolean> {
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

    return user.role.role_permissions.some((rp) => rp.permission.name === permission);
  }

  async create(data: unknown): Promise<ReviewResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const parsedData = ReviewCreateInputSchema.parse(data);
    if (parsedData.user_id !== reqUser.userId) {
      const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.CREATE_REVIEW);
      if (!hasPermission) {
        throw new Error(MESSAGES.FORBIDDEN);
      }
    }

    const hasPurchased = await ReviewRepository.hasUserPurchased(parsedData.user_id, parsedData.product_id);
    if (!hasPurchased) {
      throw new Error(MESSAGES.USER_NOT_PURCHASED_PRODUCT);
    }

    const review = await ReviewRepository.create(parsedData);
    return ReviewResponseSchema.parse(review);
  }

  async getAll(filters: ReviewFilterType): Promise<ReviewResponseType[]> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const parsedFilters = ReviewFilterSchema.parse(filters);
    const reviews = await ReviewRepository.findAll(parsedFilters);
    return reviews.map((review) => ReviewResponseSchema.parse(review));
  }

  async delete(uuid: string): Promise<void> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const review = await ReviewRepository.findById(uuid);
    if (!review) {
      throw new Error(MESSAGES.REVIEW_DELETION_FAILED);
    }

    const hasPermission = await this.checkPermission(reqUser.userId, PermissionEnum.DELETE_REVIEW);

    const user = await UserRepository.findById(reqUser.userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    if (!hasPermission && review.user_id !== user.id) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    await ReviewRepository.delete(uuid);
  }

  async findById(uuid: string): Promise<ReviewResponseType | null> {
    const review = await ReviewRepository.findById(uuid);
    if (!review) {
      return null;
    }
    return ReviewResponseSchema.parse(review);
  }
}

export default new ReviewService();
