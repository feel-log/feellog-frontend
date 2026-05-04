'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'status__bar flex items-center justify-between px-10 pt-5 pb-4.25',
        pathname === '/login' ? 'text-white' : 'text-black'
      )}
    >
      <span>{time || '00:00'}</span>
      <ul className="flex items-center gap-2">
        <li>
          {pathname === '/login' ? (
            <Image src={'/svg/celluar_white.svg'} alt={'celluar_white'} width={22} height={13} loading="lazy" />
          ) : (
            <Image src={'/svg/celluar.svg'} alt={'celluar'} width={22} height={13} loading="lazy" />
          )}
        </li>
        <li>
          {pathname === '/login' ? (
            <Image src={'/svg/wifi_white.svg'} alt={'wifi_white'} width={21} height={15} loading="lazy" />
          ) : (
            <Image src={'/svg/wifi.svg'} alt={'wifi'} width={21} height={15} loading="lazy" />
          )}
        </li>
        <li>
          {pathname === '/login' ? (
            <Image src={'/svg/battery_white.svg'} alt={'battery_white'} width={28} height={14} loading="lazy" />
          ) : (
            <Image src={'/svg/battery.svg'} alt={'battery'} width={28} height={14} loading="lazy" />
          )}
        </li>
      </ul>
    </div>
  );
}
