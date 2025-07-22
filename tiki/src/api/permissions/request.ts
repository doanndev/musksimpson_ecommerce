import instance, { getPaginatedResponse } from '../axios';
import type { PermissionResponse } from './type';

export const getPermissionsRequest = async () => {
  const response = await instance.get('/permissions');
  return getPaginatedResponse<PermissionResponse>(response);
};
