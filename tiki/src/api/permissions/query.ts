import { useQuery } from '@tanstack/react-query';
import { getPermissionsRequest } from './request';

export const usePermissionsQuery = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissionsRequest,
  });
};
