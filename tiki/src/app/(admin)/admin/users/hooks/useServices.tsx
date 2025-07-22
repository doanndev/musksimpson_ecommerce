import { deleteUserRequest, hideUserRequest, updateUserRequest } from '@/api/user/request';
import { queryClient } from '@/app/providers';
import { onMutateError } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

const useServices = () => {
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: updateUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: onMutateError,
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: onMutateError,
  });

  const { mutate: hideUserMutation } = useMutation({
    mutationFn: hideUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User hidden successfully');
    },
    onError: onMutateError,
  });

  return {
    updateUserMutation,
    deleteUserMutation,
    hideUserMutation,
  };
};

export default useServices;
