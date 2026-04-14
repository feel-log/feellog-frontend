'use client';

import React from 'react';
import { ClientOnly } from '@/shared/ui';
import { useIsMounted } from '@/shared/hooks/useIsMounted';

export default function Home() {
  const isMounted = useIsMounted();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md h-full bg-white shadow-lg">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center justify-center">
          <h1 className="text-lg font-bold">Feel-Log</h1>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="p-4 space-y-4 pb-20">
          {/* 감정 선택 배너 */}
          <ClientOnly
            fallback={
              <div className="bg-gray-200 rounded-lg h-40 animate-pulse" />
            }
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">오늘의 감정은?</h2>
              <div className="text-center text-sm text-blue-100">
                (클라이언트 전용 컴포넌트)
              </div>
            </div>
          </ClientOnly>

          {/* 통계 섹션 - 서버에서도 렌더링 가능 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">이번 달 소비</h3>
            <p className="text-3xl font-bold text-blue-600">₩0</p>
            <p className="text-sm text-gray-500 mt-2">아직 데이터가 없습니다</p>
          </div>

          {/* Hydration 상태 표시 (개발 확인용) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900">🤖 Hydration 상태</p>
            <p className="text-blue-800 mt-1">
              {isMounted ? '✓ 클라이언트 마운트됨' : '○ 서버 렌더링'}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              suppressHydrationWarning을 설정하여 SSR과 CSR 불일치를 안전하게 처리합니다.
            </p>
          </div>
        </main>

        {/* 하단 네비게이션 */}
        <ClientOnly>
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 h-16 flex justify-around">
            <button className="flex flex-col items-center justify-center flex-1 text-blue-500 font-semibold">
              <span className="text-xl">🏠</span>
              <span className="text-xs">홈</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 text-gray-600">
              <span className="text-xl">😊</span>
              <span className="text-xs">기록</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 text-gray-600">
              <span className="text-xl">📊</span>
              <span className="text-xs">분석</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 text-gray-600">
              <span className="text-xl">⚙️</span>
              <span className="text-xs">설정</span>
            </button>
          </nav>
        </ClientOnly>
      </div>
    </div>
  );
}
