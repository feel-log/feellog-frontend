'use client';

import { useEffect } from 'react';

export default function FullScreenLoader({ isLoading }: { isLoading: boolean }) {

  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
    return () => {
      document.documentElement.style.overflowY = 'auto';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 pointer-events-auto">
      <div className="flex flex-col items-center gap-4">
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
