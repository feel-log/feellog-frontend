import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <div className={'flex items-center justify-between px-4 py-2.5 relative mb-3.75'}>
      <Link href="/" style={{ width: '71px', height: '20.59px', position: 'relative' }}>
        <Image src={'/svg/feel_log_logo.svg'} alt={'logo'} loading={'eager'} fill />
      </Link>
      <button
        className={"h-6 w-6 cursor-pointer bg-[url('/svg/icon_bell.svg')] bg-cover bg-center"}
      >
        <span className={'sr-only'}>알림 버튼</span>
      </button>
      <button
        className={"h-6 w-6 cursor-pointer bg-[url('/svg/icon_search.svg')] bg-cover bg-center absolute right-13"}
      >
        <span className={'sr-only'}>검색 버튼</span>
      </button>
    </div>
  );
}