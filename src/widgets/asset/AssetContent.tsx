'use client';

import { useRouter } from 'next/navigation';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';
import { ASSET_CATEGORIES, getTotalAsset } from '@/shared/constants/assetData';

export default function AssetContent() {
  const router = useRouter();
  const totalAsset = getTotalAsset();

  return (
    <div className="flex min-h-screen flex-col bg-white pb-30">
      <PageHeader
        title="자산"
        showBack={false}
        rightAction={
          <button
            onClick={() => router.push('/record?type=asset')}
            aria-label="자산 추가"
            className="cursor-pointer"
          >
            <img src="/svg/icon_plus_black.svg" alt="" width={28} height={28} />
          </button>
        }
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
            자산을 등록하고 한눈에 관리해보세요.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.75 px-4 pt-12.5">
          {ASSET_CATEGORIES.map((category) => (
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
              <div className="flex items-center gap-1.25">
                <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
                  {category.total.toLocaleString()}원
                </p>
                <img src="/svg/icon_arrow_right.svg" alt="" width={26} height={26} />
              </div>
            </button>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
