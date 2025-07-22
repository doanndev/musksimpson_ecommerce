import { Router } from 'express';
import type { Server } from 'socket.io';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { PermissionEnum } from 'prisma/generated/client';
import ReviewController from '~/controllers/review.controller';
import { checkPermission } from '~/middleware/checkPermission.middleware';

export default function reviewRouter(io: Server) {
  const router = Router();
  const reviewController = new ReviewController(io);

  router.get('/', checkLogin, reviewController.getReviews);
  router.get('/:uuid', checkLogin, reviewController.getReviewById);
  router.post('/', checkLogin, reviewController.createReview);
  router.delete('/:uuid', checkLogin, reviewController.deleteReview);
  router.delete(
    '/admin/:uuid',
    checkLogin,
    checkPermission(PermissionEnum.DELETE_REVIEW),
    reviewController.deleteReview
  );

  return router;
}
