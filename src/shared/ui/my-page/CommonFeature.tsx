import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToken, useUser } from '@/shared/store';
import { useRouter } from 'next/navigation';
import { usePostDeviceToken } from '@/features/post-device-token';
import ConfirmModal from '@/shared/ui/ConfirmModal';

export default function CommonFeature({ title, secondary, changeLogoutModal }: { title: string; secondary: string; changeLogoutModal?: (isOpen: boolean) => void; }) {
  const [isPushedNotification, setIsPushedNotification] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clearTokens } = useToken();
  const { clearUser } = useUser();
  const router = useRouter();
  const { mutate: registerDeviceToken } = usePostDeviceToken();

  useEffect(() => {
    setIsPushedNotification(localStorage.getItem('isPushNotificationEnabled') === 'true');
    setIsMounted(true);
  }, []);

  const switchNotification = async () => {
    setIsLoading(true);
    try {
      const nextState = !isPushedNotification;

      if (nextState) {
        setIsModalOpen(true);
        setIsLoading(false);
        setIsPushedNotification(false);
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
      <ConfirmModal
        isOpen={isModalOpen}
        title="준비중인 기능입니다"
        message="푸시 알림 기능은 곧 서비스될 예정입니다."
        confirmText="확인"
        onConfirm={() => setIsModalOpen(false)}
        noCancel={true}
      />
    </div>
  );
}
