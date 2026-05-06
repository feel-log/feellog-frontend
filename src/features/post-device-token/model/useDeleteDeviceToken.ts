import { useMutation } from '@tanstack/react-query';
import { deleteDeviceTokenApi } from '../api/delete-device-token-api';

export const useDeleteDeviceToken = () => {
  return useMutation({
    mutationFn: (token: string) => deleteDeviceTokenApi(token),
  });
};
