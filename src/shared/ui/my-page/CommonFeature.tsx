import { useState } from 'react';
import Image from 'next/image';
import { useToken, useUser } from '@/shared/store';
import { useRouter } from 'next/navigation';
import { usePostDeviceToken } from '@/features/post-device-token';

export default function CommonFeature({ title, secondary, changeLogoutModal }: { title: string; secondary: string; changeLogoutModal?: (isOpen: boolean) => void; }) {
  const [isPushedNotification, setIsPushedNotification] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isPushNotificationEnabled') === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { clearTokens } = useToken();
  const { clearUser } = useUser();
  const router = useRouter();
  const { mutate: registerDeviceToken } = usePostDeviceToken();

  const switchNotification = async () => {
    setIsLoading(true);
    try {
      const nextState = !isPushedNotification;

      if (nextState) {
        const token = localStorage.getItem('fcmToken') || 'temp-token';
        const deviceType = 'WEB';

        registerDeviceToken(
          { token, deviceType },
          {
            onSuccess: () => {
              setIsPushedNotification(true);
              localStorage.setItem('isPushNotificationEnabled', 'true');
            },
            onError: () => {
              console.error('Failed to register device token');
            },
            onSettled: () => {
              setIsLoading(false);
            },
          }
        );
      } else {
        setIsPushedNotification(false);
        localStorage.setItem('isPushNotificationEnabled', 'false');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      setIsLoading(false);
    }
  };

  const moveToLogin = () => {
    clearTokens();
    clearUser();
    router.push('/login');
  }

  return (
    <div className={'common__menu px-5 mb-4'}>
      <h2 className={'mb-2 text-[14px] font-medium text-gray-500'}>{title}</h2>
      {secondary === '푸시 알림' && (
        <div className={'flex justify-between items-center w-full'}>
          <span className={'text-[14px] font-bold'}>{secondary}</span>
          <button
            className={`h-6 w-11 rounded-full relative transition-all ${
              isPushedNotification ? 'bg-[#13278a]' : 'bg-[#E5E5E5]'
            } after:absolute after:top-1/2 after:-translate-y-1/2 after:h-4 after:w-4 after:rounded-full after:bg-white after:content-[''] ${
              isPushedNotification ? 'after:right-1' : 'after:left-1'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={switchNotification}
            disabled={isLoading}
          >
            <span className={'sr-only'}>Switch Button</span>
          </button>
        </div>
      )}
      {secondary.startsWith('로그') && (
        <div className={'relative flex justify-between items-center w-full'}>
          <span className={'text-[14px] font-bold'}>{secondary}</span>
          <button className={"cursor-pointer"} onClick={() => secondary.startsWith("로그아웃") ? changeLogoutModal?.(true) : moveToLogin()}>
            <Image src={'/svg/chev_right.png'} alt={'chev_right'} width={20} height={20} />
          </button>
        </div>
      )}
    </div>
  );
}
