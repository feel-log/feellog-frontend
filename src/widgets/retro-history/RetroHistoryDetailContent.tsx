'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { reviewQueries } from '@/entities/review/api/review-queries';
import { useToken } from '@/shared/store';
import { useDeleteReview } from '@/features/delete-review/model/useDeleteReview';
import RetroDeleteModal from './RetroDeleteModal';
import RetroHistoryDetailSkeleton from './RetroHistoryDetailSkeleton';

interface RetroHistoryDetailContentProps {
  date: string;
}

export default function RetroHistoryDetailContent({ date }: RetroHistoryDetailContentProps) {
  const router = useRouter();
  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: item, isLoading } = useQuery({
    ...reviewQueries.byDate(token || '', date),
    enabled: !!token && mounted,
  });

  const deleteMutation = useDeleteReview();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const timer = window.setTimeout(() => {
      document.addEventListener('click', handler);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', handler);
    };
  }, [isMenuOpen]);

  const handleEdit = () => {
    setIsMenuOpen(false);
    router.push(`/retro/survey?date=${date}`);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(date, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.replace('/retro/history');
      },
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* 헤더 */}
      <div className="relative flex h-14 items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 flex h-7 w-7 cursor-pointer items-center justify-center"
          aria-label="뒤로"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M17 6L9 14L17 22" stroke="#27282C" strokeWidth="1.87" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[20px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
          회고
        </h1>
        {item && (
          <div ref={menuRef} className="absolute right-4 z-20">
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center"
              aria-label="메뉴"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="7" r="1.5" fill="#27282C" />
                <circle cx="14" cy="14" r="1.5" fill="#27282C" />
                <circle cx="14" cy="21" r="1.5" fill="#27282C" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 flex w-[100px] flex-col overflow-hidden rounded-[10.46px] border-[1.31px] border-[#E5E5E5] bg-white">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex h-[34px] w-full cursor-pointer items-center bg-white px-[15px] py-[5px] text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-[#474C52]"
                >
                  삭제
                </button>
                <div className="h-px w-full bg-[#E5E5E5]" />
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex h-[34px] w-full cursor-pointer items-center bg-white px-[15px] py-[5px] text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-[#474C52]"
                >
                  수정
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!mounted || isLoading ? (
        <RetroHistoryDetailSkeleton />
      ) : !item ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[14px] text-[#9FA4A8]">회고 데이터를 찾을 수 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 px-4 pt-5 pb-25">
        {/* 섹션 1: 타이틀 + 결과 카드 */}
        <div className="flex flex-col gap-5">
          <p className="whitespace-pre-line text-[22px] font-bold leading-normal tracking-[-0.025em] text-[#1C1D1F]">
            {item.title.prefixText}
            <br />
            <span className="text-[#13278A]">{item.title.highlightText}</span>
            {item.title.suffixText}
          </p>

          <div
            className="flex flex-col gap-1.5 rounded-xl p-4"
            style={{
              background:
                'linear-gradient(98.51deg, #F7F8FA -1.34%, #ECF2FC 70.89%, #D8E8FF 119.81%) padding-box, linear-gradient(98.51deg, #6B9CE5 0%, #13278A 100%) border-box',
              border: '1px solid transparent',
            }}
          >
            <div className="flex items-center gap-2.5">
              <p className="w-[75px] whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#474C52]">
                소비 이유:
              </p>
              <p className="text-[16px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
                {item.options.situationTagName}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <p className="w-[75px] whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#474C52]">
                만족도:
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="20" height="20" viewBox="0 0 20 19" fill="none">
                    <path
                      d="M9.51074 0L11.7559 6.90983H19.0213L13.1435 11.1803L15.3886 18.0902L9.51074 13.8197L3.63289 18.0902L5.87803 11.1803L0.000177383 6.90983H7.2656L9.51074 0Z"
                      fill={star <= item.options.satisfactionScore ? '#13278A' : '#CACDD2'}
                    />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <p className="w-[75px] whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#474C52]">
                내일의 다짐:
              </p>
              <p className="text-[16px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
                {item.options.nextActionOptionText}
              </p>
            </div>
          </div>
        </div>

        {/* 섹션 2: 💡 피드백 */}
        <div className="flex w-full flex-col gap-3.75">
          <div className="flex items-center gap-1">
            <span className="text-[20px]">💡</span>
            <p className="whitespace-nowrap text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
              {item.result.feedbackTitle}
            </p>
          </div>
          <div className="w-full rounded-xl bg-[#F7F8FA] p-4">
            <p className="whitespace-pre-line text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#27282C]">
              {item.result.feedbackText}
            </p>
          </div>
        </div>

        {/* 섹션 3: 📋 가이드 */}
        <div className="flex w-full flex-col gap-3.75">
          <div className="flex items-center gap-1">
            <span className="text-[20px]">📋</span>
            <p className="whitespace-nowrap text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
              {item.result.guideTitle}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 rounded-xl bg-[#F7F8FA] p-4">
            {item.result.guideItems.map((g, idx) => (
              <div key={`${item.reviewId}-${idx}`} className="flex items-center gap-1.5">
                <span className="flex h-3.75 w-3.75 shrink-0 items-center justify-center rounded-full bg-[#13278A]">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path
                      d="M1.5 4.5L3.5 6.5L7.5 2"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#27282C]">
                  {g}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      <RetroDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
