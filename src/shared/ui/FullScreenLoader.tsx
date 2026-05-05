'use client';

import { useEffect } from 'react';

export default function FullScreenLoader({ isLoading }: { isLoading: boolean }) {
  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.height = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.height = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-white">
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* 스피너 */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#13278a] rounded-full animate-spin"></div>
        </div>
        {/* 로딩 텍스트 */}
        <p className="text-sm text-gray-600 font-medium">로딩 중...</p>
      </div>
    </div>
  );
}
