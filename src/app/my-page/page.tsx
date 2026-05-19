"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PageHeader from '@/shared/ui/PageHeader';
import Footer from '@/shared/ui/Footer';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import { useToken, useUser } from '@/shared/store';
import { LogoutModal } from '@/features/logout/ui/LogoutModal';

function MyPageContent() {
  const router = useRouter();
  const { clearTokens, setErrorBox } = useToken();
  const isLoaded = useUser((s) => s.isLoaded);
  const id = useUser((s) => s.id);
  const nickname = useUser((s) => s.nickname);
  const provider = useUser((s) => s.provider);
  const clearUser = useUser((s) => s.clearUser);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  useEffect(() => {
    setIsPushNotificationEnabled(localStorage.getItem('isPushNotificationEnabled') === 'true');
  }, []);

  const handleTogglePush = () => {
    if (!isPushNotificationEnabled) {
      setIsPushModalOpen(true);
      return;
    }
    setIsPushNotificationEnabled(false);
    localStorage.setItem('isPushNotificationEnabled', 'false');
  };

  const isGuest = isLoaded && (!id || nickname.startsWith('guest'));

  const handleAccountClick = () => {
    if (isGuest) {
      clearTokens();
      clearUser();
      router.push('/login');
      return;
    }
    setIsLogoutModalOpen(true);
  };

  const handleRetroHistoryClick = () => {
    if (isGuest) {
      setErrorBox(true);
      return;
    }
    router.push('/retro/history');
  };

  const providerLabel = isGuest
    ? '게스트로 로그인'
    : provider === 'GOOGLE'
      ? '구글로 로그인'
      : provider === 'KAKAO'
        ? '카카오로 로그인'
        : '';

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-30">
      <PageHeader title="마이페이지" showBack={false} />

      <div className="flex flex-col gap-6.25 pt-2.5">
        {/* 프로필 카드 */}
        <div className="px-4">
          <div className="flex items-center gap-3.75 rounded-[12px] bg-[#F7F8FA] p-4">
            <div className="relative h-15 w-15 shrink-0">
              <Image src="/svg/character1.png" alt="profile" fill className="object-contain" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
                {isLoaded ? nickname : '로딩 중...'}
              </span>
              <span className="text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#353535]">
                {isLoaded ? providerLabel : ''}
              </span>
            </div>
          </div>
        </div>

        {/* 알림 섹션 */}
        <section className="flex flex-col gap-2.5 px-4">
          <h2 className="text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]">
            알림
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#1C1D1F]">
              푸시 알림
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isPushNotificationEnabled}
              onClick={handleTogglePush}
              className={`flex h-[32px] w-[58px] cursor-pointer items-center rounded-full p-[5px] transition-colors ${
                isPushNotificationEnabled ? 'justify-end bg-[#13278a]' : 'justify-start bg-[#CACDD2]'
              }`}
              aria-label="푸시 알림"
            >
              <span className="h-[22px] w-[22px] rounded-full bg-white" />
            </button>
          </div>
        </section>

        {/* 계정 관리 섹션 */}
        <section className="flex flex-col gap-2.5 px-4">
          <h2 className="text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]">
            계정 관리
          </h2>
          <button
            type="button"
            onClick={handleAccountClick}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#1C1D1F]">
              {isGuest ? '로그인하기' : '로그아웃'}
            </span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8.7998 18.4L15.1998 12L8.7998 5.59998" stroke="#73787E" strokeWidth="1.86667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>

        {/* 회고 관리 섹션 */}
        <section className="flex flex-col gap-2.5 px-4">
          <h2 className="text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]">
            회고 관리
          </h2>
          <button
            type="button"
            onClick={handleRetroHistoryClick}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#1C1D1F]">
              회고록
            </span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8.7998 18.4L15.1998 12L8.7998 5.59998" stroke="#73787E" strokeWidth="1.86667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>
      </div>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={setIsLogoutModalOpen} />

      <ConfirmModal
        isOpen={isPushModalOpen}
        title="준비중인 기능입니다"
        message="푸시 알림 기능은 곧 서비스될 예정입니다."
        confirmText="확인"
        onConfirm={() => setIsPushModalOpen(false)}
        noCancel
      />

      <Footer />
    </div>
  );
}

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  );
}
