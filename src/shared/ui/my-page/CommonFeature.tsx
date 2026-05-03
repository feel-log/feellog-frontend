import { useState } from 'react';
import Image from 'next/image';

export default function CommonFeature({ title, secondary, changeLogoutModal }: { title: string; secondary: string; changeLogoutModal?: (isOpen: boolean) => void; }) {
  const [isPushedNotification, setIsPushedNotification] = useState(false);

  const switchNotification = () => {
    setIsPushedNotification((prev) => !prev);
  };

  return (
    <div className={'common__menu px-5 mb-4'}>
      <h2 className={'mb-2 text-[14px] font-bold text-gray-500'}>{title}</h2>
      {secondary === '푸시 알림' && (
        <div className={'flex justify-between items-center w-full'}>
          <span className={'text-[14px] font-bold'}>{secondary}</span>
          <button
            className={`h-8 w-14.5 rounded-full relative bg-[#13278a] after:absolute after:top-0 after:bottom-0 after:my-auto after:h-5 after:w-5 after:rounded-full after:bg-white after:content-[''] ${
              isPushedNotification ? 'after:right-1.5' : 'after:left-1.5 opacity-45'
            }`}
            onClick={switchNotification}
          >
            <span className={'sr-only'}>Switch Button</span>
          </button>
        </div>
      )}
      {secondary.startsWith('로그') && (
        <div className={'relative flex justify-between items-center w-full'}>
          <span className={'text-[14px] font-bold'}>{secondary}</span>
          <button onClick={() => changeLogoutModal?.(true)}>
            <Image src={'/svg/chev_right.png'} alt={'chev_right'} width={20} height={20} />
          </button>
        </div>
      )}
    </div>
  );
}
