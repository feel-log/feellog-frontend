'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { useGetAssets } from '@/entities/get-assets/useGetAssets';
import { useToken, useUser } from '@/shared/store';

export default function AssetContent() {
  const router = useRouter();
  const { getUser } = useUser();
  const { getAccessToken } = useToken();
  const user = getUser();
  const accessToken = getAccessToken();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: assetsData, isLoading } = useGetAssets({
    page: 0,
    size: 100,
  });

  const totalAsset = assetsData?.totalAmount ?? 0;
  const groupedAssets = assetsData?.categories ?? [];

  const handleAddAsset = () => {
    if (!accessToken || user?.nickname?.startsWith('guest')) {
      setShowLoginModal(true);
      return;
    }
    router.push('/record?type=asset');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-white pb-30">
        <PageHeader title="자산" showBack={false} />

        <div className="flex flex-col gap-1.25 border-b-[5px] border-[#F7F8FA] px-4 pb-3.75">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-2" />
        </div>

        <div className="flex flex-col gap-3.75 px-4 pt-12.5">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3.5 rounded-full bg-gray-200" />
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-30">
      <PageHeader
        title="자산"
        showBack={false}
        rightAction={
          <button
            onClick={handleAddAsset}
            aria-label="자산 추가"
            className="cursor-pointer"
          >
            <img src="/svg/icon_plus_black.svg" alt="" width={28} height={28} />
          </button>
        }
      />

      <ConfirmModal
        isOpen={showLoginModal}
        type="loginCheck"
        title="로그인 후 이용 가능합니다."
        secondary="로그인 하시겠습니까?"
        onCancel={() => setShowLoginModal(false)}
        onConfirm={() => {
          setShowLoginModal(false);
          router.push('/login');
        }}
      />


      {/* 총 자산 */}
      <div className="flex flex-col gap-1.25 border-b-[5px] border-[#F7F8FA] px-4 pb-3.75">
        <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
          총 자산
        </p>
        <p className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
          {totalAsset.toLocaleString()}원
        </p>
      </div>

      {totalAsset === 0 ? (
        <div className="flex flex-col items-center pt-62.5">
          <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#474C52]">
            아직 등록된 자산이 없어요
          </p>
          <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
            자산을 등록하고 한눈에 관리해보세요
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.75 px-4 pt-7.5">
          {groupedAssets.map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(`/asset/${category.id}`)}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-[18px] font-medium leading-normal tracking-[-0.45px] text-[#1C1D1F]">
                  {category.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
                  {category.total.toLocaleString()}원
                </p>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8.7998 18.4L15.1998 12L8.7998 5.59998" stroke="#9FA4A8" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
