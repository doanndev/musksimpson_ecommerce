import type { Request, Response } from 'express';
import type { Server } from 'socket.io';
import ReviewService from '~/services/review.service';
import { response } from '~/libs/utils/response.util';
import { MESSAGES } from '~/libs/constants/messages.constant';

class ReviewController {
  constructor(private io?: Server) {}

  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const review = await ReviewService.create(req.body);
      if (this.io) {
        this.io.emit(`product:${review.product_id}:review`, review);
      }
      response.success(res, review, MESSAGES.REVIEW_CREATED);
    } catch (error: any) {
      console.error('Create Review Error:', error.message);
      response.badRequest(res, null, error.message || MESSAGES.REVIEW_CREATION_FAILED);
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const reviews = await ReviewService.getAll(req.query);
      response.success(res, reviews, MESSAGES.REVIEWS_RETRIEVED);
    } catch (error: any) {
      console.error('Get Reviews Error:', error.message);
      response.badRequest(res, null, error.message || MESSAGES.REVIEW_RETRIEVAL_FAILED);
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      await ReviewService.delete(uuid);
      response.success(res, null, MESSAGES.REVIEW_DELETED);
    } catch (error: any) {
      console.error('Delete Review Error:', error.message);
      response.badRequest(res, null, error.message || MESSAGES.REVIEW_DELETION_FAILED);
    }
  }

  async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      const review = await ReviewService.findById(uuid);
      if (!review) {
        response.notFound(res, MESSAGES.REVIEW_RETRIEVAL_FAILED);
        return;
      }
      response.success(res, review, MESSAGES.REVIEW_RETRIEVED);
    } catch (error: any) {
      console.error('Get Review By Id Error:', error.message);
      response.badRequest(res, null, error.message || MESSAGES.REVIEW_RETRIEVAL_FAILED);
    }
  }
}

export default ReviewController;
