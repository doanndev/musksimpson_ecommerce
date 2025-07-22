import { type UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  createAddressRequest,
  deleteAddressRequest,
  getAddressByIdRequest,
  getAddressesRequest,
  updateAddressRequest,
} from './request';
import type { AddressCreateInput, AddressIdParam, AddressResponse, AddressUpdateInput } from './type';

export enum AddressQueryKey {
  ADDRESSES = 'addresses',
}

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: [AddressQueryKey.ADDRESSES],
    queryFn: getAddressesRequest,
  });
};

export const useAddressByIdQuery = ({ id }: AddressIdParam) => {
  return useQuery({
    queryKey: [AddressQueryKey.ADDRESSES, id],
    queryFn: () => getAddressByIdRequest({ id }),
  });
};

export const useCreateAddressMutation = (options?: UseMutationOptions<AddressResponse, Error, AddressCreateInput>) => {
  return useMutation({
    mutationFn: (params: AddressCreateInput) => createAddressRequest(params),
    ...options,
  });
};

export const useUpdateAddressMutation = (
  options?: UseMutationOptions<AddressResponse, Error, AddressIdParam & AddressUpdateInput>
) => {
  return useMutation({
    mutationFn: (params: AddressIdParam & AddressUpdateInput) => updateAddressRequest(params),
    ...options,
  });
};

export const useDeleteAddressMutation = (options?: UseMutationOptions<null, Error, AddressIdParam>) => {
  return useMutation({
    mutationFn: (params: AddressIdParam) => deleteAddressRequest(params),
    ...options,
  });
};
