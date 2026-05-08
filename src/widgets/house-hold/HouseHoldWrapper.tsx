import Image from 'next/image';
import HouseHoldBoxWrapper from '@/widgets/house-hold/HouseHoldBoxWrapper';
import { ClientOnly } from '@/shared/ui';
import { DateDisplay } from './DateDisplay';

export default function HouseHoldWrapper() {
  return (
    <div className={"house__hold__wrapper relative px-4"}>
      <div className="absolute right-20 top-0">
        <Image
          src="/svg/character1.svg"
          alt="decoration"
          width={88}
          height={88}
          priority
          unoptimized
        />
      </div>
      <div className="absolute right-23 top-13.5 z-10">
        <Image
          src="/svg/character_hand.svg"
          alt="decoration hand"
          width={64}
          height={22}
          priority
          unoptimized
        />
      </div>
      <div className="absolute right-8 top-9 z-1">
        <Image
          src="/svg/character2.svg"
          alt="decoration second"
          width={40}
          height={40}
          priority
          unoptimized
        />
      </div>
      <h2 className={"text-[18px] font-semibold tracking-[-0.025em] text-[#27282c] pt-7.5 pb-2"}>
        <ClientOnly fallback="날짜를 로드 중입니다..">
          <DateDisplay />
        </ClientOnly>
      </h2>
      <HouseHoldBoxWrapper />
    </div>
  );
}