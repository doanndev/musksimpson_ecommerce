import { useQuery } from '@tanstack/react-query';
import { getReviewByIdRequest, getReviewsRequest } from './request';
import type { ReviewFilter, UuidParam } from './type';

export const useReviewsQuery = (filter?: ReviewFilter) => {
  return useQuery({
    queryKey: ['reviews', filter],
    queryFn: () => getReviewsRequest(filter),
  });
};

export const useReviewByIdQuery = ({ uuid }: UuidParam) => {
  return useQuery({
    queryKey: ['review', uuid],
    queryFn: () => getReviewByIdRequest({ uuid }),
  });
};
