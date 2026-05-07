'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import { reviewQueries } from '@/entities/review';
import PageHeader from '@/shared/ui/PageHeader';
import Skeleton from '@/shared/ui/Skeleton';

function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function RetroResultContent() {
  const searchParams = useSearchParams();
  const date = searchParams?.get('date') ?? todayDateString();

  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const { data, isLoading } = useQuery({
    ...reviewQueries.byDate(token || '', date),
    enabled: !!token,
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="회고 결과"
        showBack={false}
        showClose
        closeHref="/retro"
      />

      {isLoading || !data ? (
        <div className="flex flex-col gap-6 px-4 pt-5 pb-25">
          <Skeleton className="h-30 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-10 px-4 pt-5 pb-25">
          {/* 섹션 1: 타이틀 + 결과 카드 */}
          <div className="flex flex-col gap-5">
            <p className="text-[22px] font-bold leading-normal tracking-[-0.55px] text-[#1C1D1F]">
              {data.title.prefixText}
              <br />
              <span className="text-[#13278A]">{data.title.highlightText}</span>
              {data.title.suffixText}
            </p>

            <div
              className="flex h-30 w-full flex-col gap-1.5 rounded-xl p-4"
              style={{
                background:
                  'linear-gradient(98.51deg, #F7F8FA -1.34%, #ECF2FC 70.89%, #D8E8FF 119.81%) padding-box, linear-gradient(98.51deg, #6B9CE5 0%, #13278A 100%) border-box',
                border: '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2.5">
                <p className="w-18.75 whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
                  소비 이유:
                </p>
                <p className="text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#030303]">
                  {data.options.situationTagName}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <p className="w-18.75 whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
                  만족도:
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="20" height="20" viewBox="0 0 20 19" fill="none">
                      <path
                        d="M9.51074 0L11.7559 6.90983H19.0213L13.1435 11.1803L15.3886 18.0902L9.51074 13.8197L3.63289 18.0902L5.87803 11.1803L0.000177383 6.90983H7.2656L9.51074 0Z"
                        fill={star <= data.options.satisfactionScore ? '#13278A' : '#CACDD2'}
                      />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <p className="w-18.75 whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
                  내일의 다짐:
                </p>
                <p className="text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#030303]">
                  {data.options.nextActionOptionText}
                </p>
              </div>
            </div>
          </div>

          {/* 섹션 2: 💡 + 피드백 박스 */}
          <div className="flex w-full flex-col gap-3.75">
            <div className="flex items-center gap-1">
              <span className="text-[20px]">💡</span>
              <p className="whitespace-nowrap text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
                {data.result.feedbackTitle}
              </p>
            </div>
            <div className="w-full rounded-xl bg-[#F7F8FA] p-4">
              <p className="whitespace-pre-line text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#27282C]">
                {data.result.feedbackText}
              </p>
            </div>
          </div>

          {/* 섹션 3: 📋 + 액션 박스 */}
          <div className="flex w-full flex-col gap-3.75">
            <div className="flex items-center gap-1">
              <span className="text-[20px]">📋</span>
              <p className="whitespace-nowrap text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
                {data.result.guideTitle}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 rounded-xl bg-[#F7F8FA] p-4">
              {data.result.guideItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="flex size-3.75 shrink-0 items-center justify-center rounded-full bg-[#13278A]">
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
                  <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#27282C]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
