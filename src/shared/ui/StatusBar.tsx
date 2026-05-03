'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

export default function StatusBar() {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'status__bar flex items-center justify-between px-10 pt-5 pb-4.25',
        pathname === '/login' ? 'text-white' : 'text-black'
      )}
    >
      <span>9:41</span>
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
