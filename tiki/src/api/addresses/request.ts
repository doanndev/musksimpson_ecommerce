import instance, { getPaginatedResponse, getSuccessResponse } from '../axios';
import type { AddressCreateInput, AddressIdParam, AddressResponse, AddressUpdateInput } from './type';

export const getAddressesRequest = async () => {
  const response = await instance.get('/addresses');
  return getPaginatedResponse<AddressResponse>(response);
};

export const createAddressRequest = async (data: AddressCreateInput) => {
  const response = await instance.post('/addresses', data);
  return getSuccessResponse<AddressResponse>(response);
};

export const getAddressByIdRequest = async ({ id }: AddressIdParam) => {
  const response = await instance.get(`/addresses/${id}`);
  return getSuccessResponse<AddressResponse>(response);
};

export const updateAddressRequest = async ({ id, ...data }: AddressIdParam & AddressUpdateInput) => {
  const response = await instance.put(`/addresses/${id}`, data);
  return getSuccessResponse<AddressResponse>(response);
};

export const deleteAddressRequest = async ({ id }: AddressIdParam) => {
  const response = await instance.delete(`/addresses/${id}`);
  return getSuccessResponse<null>(response);
};
