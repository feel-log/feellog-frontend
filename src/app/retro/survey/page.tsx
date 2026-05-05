'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import { reviewQueries, upsertReviewApi } from '@/entities/review';
import ChipSelect from '@/widgets/retro/ChipSelect';
import ListSelect from '@/widgets/retro/ListSelect';
import PageHeader from '@/shared/ui/PageHeader';

function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function RetroSurveyPage() {
  const router = useRouter();
  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const { data: options, isLoading } = useQuery({
    ...reviewQueries.options(token || ''),
    enabled: !!token,
  });

  const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(null);
  const [selectedSituationTagId, setSelectedSituationTagId] = useState<number | null>(null);
  const [selectedSatisfactionId, setSelectedSatisfactionId] = useState<number | null>(null);
  const [selectedNextActionId, setSelectedNextActionId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const isAllSelected =
    selectedEmotionId != null &&
    selectedSituationTagId != null &&
    selectedSatisfactionId != null &&
    selectedNextActionId != null;

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () =>
      upsertReviewApi({
        reviewDate: todayDateString(),
        token: token || '',
        body: {
          emotionId: selectedEmotionId!,
          situationTagId: selectedSituationTagId!,
          satisfactionOptionId: selectedSatisfactionId!,
          nextActionOptionId: selectedNextActionId!,
        },
      }),
    onSuccess: () => {
      router.push(`/retro/result?date=${todayDateString()}`);
    },
    onError: (error) => {
      console.error('회고 저장 실패', error);
    },
  });

  const handleSubmit = () => {
    if (!isAllSelected) {
      setSubmitted(true);
      setShakeKey((prev) => prev + 1);
      return;
    }
    submitReview();
  };

  if (isLoading || !options) {
    return (
      <div className="flex flex-1 flex-col">
        <PageHeader title="회고하기" backHref="/retro" />
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-[14px] text-[#9FA4A8]">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const emotionItems = options.emotions.map((e) => ({ id: e.emotionId, label: e.name }));
  const situationItems = options.situationTags.map((s) => ({ id: s.situationTagId, label: s.name }));
  const satisfactionItems = options.satisfactionOptions.map((o) => ({ id: o.optionId, label: o.optionText }));
  const nextActionItems = options.nextActionOptions.map((o) => ({ id: o.optionId, label: o.optionText }));

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="회고하기" backHref="/retro" />

      <div className="flex flex-1 flex-col gap-12.5 overflow-y-auto pb-36 pt-5">
        {/* Q1. 감정 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              오늘 소비를 이끈 감정은 무엇이였나요?
            </p>
            {submitted && selectedEmotionId == null && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ChipSelect
            options={emotionItems.map((i) => i.label)}
            selected={emotionItems.find((i) => i.id === selectedEmotionId)?.label ?? null}
            onChange={(label) => {
              const found = emotionItems.find((i) => i.label === label);
              setSelectedEmotionId(found ? found.id : null);
            }}
          />
        </div>

        {/* Q2. 상황 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              어떤 상황에서 소비하게 됐나요?
            </p>
            {submitted && selectedSituationTagId == null && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ChipSelect
            options={situationItems.map((i) => i.label)}
            selected={situationItems.find((i) => i.id === selectedSituationTagId)?.label ?? null}
            onChange={(label) => {
              const found = situationItems.find((i) => i.label === label);
              setSelectedSituationTagId(found ? found.id : null);
            }}
          />
        </div>

        {/* Q3. 만족도 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              소비가 전반적으로 만족스러웠나요?
            </p>
            {submitted && selectedSatisfactionId == null && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ListSelect
            options={satisfactionItems.map((i) => i.label)}
            selected={satisfactionItems.find((i) => i.id === selectedSatisfactionId)?.label ?? null}
            onChange={(label) => {
              const found = satisfactionItems.find((i) => i.label === label);
              setSelectedSatisfactionId(found ? found.id : null);
            }}
          />
        </div>

        {/* Q4. 내일 계획 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              내일은 어떻게 소비하고 싶나요?
            </p>
            {submitted && selectedNextActionId == null && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ListSelect
            options={nextActionItems.map((i) => i.label)}
            selected={nextActionItems.find((i) => i.id === selectedNextActionId)?.label ?? null}
            onChange={(label) => {
              const found = nextActionItems.find((i) => i.label === label);
              setSelectedNextActionId(found ? found.id : null);
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center justify-center bg-white px-4 pt-6 pb-9">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`h-13.5 w-full rounded-[10px] text-[20px] font-semibold ${
            isAllSelected
              ? 'bg-[#13278A] text-white'
              : 'bg-[#E5E5E5] text-[#9FA4A8]'
          }`}
        >
          {isPending ? '저장 중...' : '결과보기'}
        </button>
      </div>
    </div>
  );
}
