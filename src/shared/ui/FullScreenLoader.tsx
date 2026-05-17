'use client';

import { useEffect } from 'react';

/**
 * Display a full-screen loading overlay and toggle the `hiddens` class on the root `<html>` element while loading.
 *
 * While `isLoading` is true the component renders a centered spinner overlay and adds the `hiddens` class to `document.documentElement`; when `isLoading` is false the class is removed. The `hiddens` class is also removed on unmount to avoid leaving it set.
 *
 * @param isLoading - If `true`, show the overlay and add the `hiddens` class to the `<html>` element; if `false`, hide the overlay and remove the class
 * @returns A full-screen overlay element when `isLoading` is true, otherwise `null`
 */
export default function FullScreenLoader({ isLoading }: { isLoading: boolean }) {
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isLoading) {
      htmlElement.classList.add('hiddens');
    } else {
      htmlElement.classList.remove('hiddens');
    }
    return () => {
      htmlElement.classList.remove('hiddens');
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
