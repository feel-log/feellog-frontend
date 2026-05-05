import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <div className={'flex h-12 items-center justify-between bg-[#cce1ff] px-4'}>
      <Link href="/" style={{ width: '91px', height: '26.81px', position: 'relative' }}>
        <Image src={'/svg/feel_log_logo.svg'} alt={'logo'} loading={'eager'} fill />
      </Link>
      <button
        className={"h-7.5 w-7.5 cursor-pointer bg-[url('/svg/icon_bell.svg')] bg-cover bg-center"}
      >
        <span className={'sr-only'}>알림 버튼</span>
      </button>
    </div>
  );
}