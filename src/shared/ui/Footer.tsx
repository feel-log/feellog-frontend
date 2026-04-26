'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { id: 'household', label: '가계부', path: '/', icon: 'household' },
  { id: 'report', label: '리포트', path: '/report', icon: 'chart' },
  { id: 'asset', label: '자산', path: '/asset', icon: 'asset' },
  { id: 'my_page', label: '마이페이지', path: '/my_page', icon: 'user' },
];

function FooterIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'household':
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="7" y="13" width="16" height="12" fill="#1C1D1F" />
          <path
            d="M22 7H8C6.89543 7 6 7.89543 6 9V23C6 24.1046 6.89543 25 8 25H22C23.1046 25 24 24.1046 24 23V9C24 7.89543 23.1046 7 22 7Z"
            stroke="#1C1D1F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 5V9.00001"
            stroke="#1C1D1F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 5V9.00001"
            stroke="#1C1D1F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 13H24"
            stroke="#1C1D1F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.9126 16.3936L13.2106 20.5669C13.2305 20.6311 13.2723 20.6877 13.3298 20.7285C13.3874 20.7693 13.4576 20.792 13.5302 20.7935C13.6029 20.7949 13.6741 20.7749 13.7335 20.7365C13.7929 20.698 13.8373 20.6431 13.8602 20.5798L15.1126 17.1284L16.365 20.5798C16.3879 20.6431 16.4323 20.698 16.4917 20.7365C16.5511 20.7749 16.6223 20.7949 16.695 20.7935C16.7676 20.792 16.8378 20.7693 16.8954 20.7285C16.9529 20.6877 16.9947 20.6311 17.0146 20.5669L18.3126 16.3936"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.1128 17.9941H11.1128M19.1128 17.9941L18.1128 17.9941"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'chart':
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 6L5 24H25"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.73193 17.6201L14.5401 12.4646L17.8105 15.7154L23.7319 9.62012"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'asset':
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="15" cy="14.8691" r="10" fill="black" stroke="black" strokeWidth="2" />
          <path
            d="M10.2002 12L12.1472 18.26C12.1771 18.3563 12.2398 18.4412 12.3261 18.5024C12.4123 18.5636 12.5177 18.5977 12.6266 18.5999C12.7356 18.602 12.8425 18.5721 12.9315 18.5144C13.0206 18.4567 13.0872 18.3743 13.1216 18.2793L15.0002 13.1023L16.8788 18.2793C16.9132 18.3743 16.9798 18.4567 17.0689 18.5144C17.1579 18.5721 17.2648 18.602 17.3737 18.5999C17.4827 18.5977 17.5881 18.5636 17.6743 18.5024C17.7606 18.4412 17.8233 18.3563 17.8532 18.26L19.8002 12"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 14.4004H9M21 14.4004L19.5 14.4004"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'user':
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5003 13.2964C16.7913 13.2964 18.6485 11.4392 18.6485 9.14821C18.6485 6.85722 16.7913 5 14.5003 5C12.2093 5 10.3521 6.85722 10.3521 9.14821C10.3521 11.4392 12.2093 13.2964 14.5003 13.2964Z"
            fill="#000"
            stroke="#000"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 24.0004V21.708C24 20.492 23.4996 19.3258 22.6088 18.4659C21.718 17.6061 20.5098 17.123 19.25 17.123H9.75C8.49022 17.123 7.28204 17.6061 6.39124 18.4659C5.50044 19.3258 5 20.492 5 21.708V24.0004"
            fill="#000"
          />
          <path
            d="M24 24.0004V21.708C24 20.492 23.4996 19.3258 22.6088 18.4659C21.718 17.6061 20.5098 17.123 19.25 17.123H9.75C8.49022 17.123 7.28204 17.6061 6.39124 18.4659C5.50044 19.3258 5 20.492 5 21.708V24.0004H24Z"
            stroke="#000"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-md bg-[url('/svg/subtract.png')] bg-center">
      <div className="relative h-22.5 flex justify-between">
        <div className="flex w-full">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 text-black font-bold cursor-pointer px-6.5 mt-2 ${
                pathname === item.path ? 'opacity-100' : 'opacity-50'
              }
              ${
                index === 1 ? 'mr-7.75' : ''
              }
              ${
                index === 2 ? 'ml-7.75' : ''
              }`}
            >
              <FooterIcon icon={item.icon} />
              <span className="text-[16px] font-medium whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/record')}
          className="absolute cursor-pointer -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors"
        >
          <Image src={"/svg/icon_plus.svg"} alt={"plus"} width={26} height={26} />
        </button>
      </div>
    </div>
  );
}