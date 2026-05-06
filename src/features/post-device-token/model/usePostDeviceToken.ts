import { useMutation } from '@tanstack/react-query';
import { postDeviceTokenApi } from '../api/post-device-token-api';

interface DeviceTokenRequest {
  token: string;
  deviceType: string;
}

export const usePostDeviceToken = () => {
  return useMutation({
    mutationFn: (request: DeviceTokenRequest) =>
      postDeviceTokenApi(request),
  });
};
