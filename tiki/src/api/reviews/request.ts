import instance, { getPaginatedResponse, getSuccessResponse } from '../axios';
import type { ReviewCreateInput, ReviewFilter, ReviewResponse, UuidParam } from './type';

export const getReviewsRequest = async (filter?: ReviewFilter) => {
  const response = await instance.get('/reviews', { params: filter });
  return getPaginatedResponse<ReviewResponse>(response);
};

export const createReviewRequest = async (data: ReviewCreateInput) => {
  const response = await instance.post('/reviews', data);
  return getSuccessResponse<ReviewResponse>(response);
};

export const getReviewByIdRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.get(`/reviews/${uuid}`);
  return getSuccessResponse<ReviewResponse>(response);
};

export const deleteReviewRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.delete(`/reviews/${uuid}`);
  return getSuccessResponse<null>(response);
};

export const deleteAdminReviewRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.delete(`/reviews/admin/${uuid}`);
  return getSuccessResponse<null>(response);
};
