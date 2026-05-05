import Image from 'next/image';
import HouseHoldBoxWrapper from '@/widgets/house-hold/HouseHoldBoxWrapper';
import { ClientOnly } from '@/shared/ui';
import { DateDisplay } from './DateDisplay';

export default function HouseHoldWrapper() {
  return (
    <div className={"house__hold__wrapper relative px-4"}>
      <div className="absolute right-20 top-0">
        <Image
          src="/svg/free_log_chc.png"
          alt="decoration"
          width={88}
          height={88}
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
      </div>
      <div className="absolute right-25.5 top-14 z-10">
        <Image
          src="/svg/free_log_chc_hand.png"
          alt="decoration hand"
          width={44}
          height={12}
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
      </div>
      <div className="absolute right-8 top-9 z-1">
        <Image
          src="/svg/free_log_chc_second.png"
          alt="decoration second"
          width={40}
          height={40}
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
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