'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChipSelect from '@/features/retro/ui/ChipSelect';
import ListSelect from '@/features/retro/ui/ListSelect';
import PageHeader from '@/shared/ui/PageHeader';

const EMOTIONS = [
  '기쁨', '설렘', '뿌듯함', '고마움',
  '짜증', '화남', '불안함', '슬픔',
  '스트레스', '우울함', '심심함', '피곤함',
  '공허함', '외로움', '충동',
];

const SITUATIONS = [
  '피로 회복', '기분 전환', '보상 심리', '충동소비',
  '할인', '약속', '지각', '필요',
  '기타',
];

const SATISFACTION = [
  '매우 만족스럽다',
  '만족스럽다',
  '보통이다',
  '아쉽다',
  '매우 아쉽다',
];

const TOMORROW_PLAN = [
  '오늘처럼 유지할래요',
  '조금 더 신중하게 소비할래요',
  '지출을 줄여볼래요',
  '꼭 필요한 것만 구매할래요',
];

export default function RetroSurveyPage() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedSatisfaction, setSelectedSatisfaction] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const isAllSelected =
    selectedEmotion && selectedSituation && selectedSatisfaction && selectedPlan;

  const handleSubmit = () => {
    if (!isAllSelected) {
      setSubmitted(true);
      setShakeKey((prev) => prev + 1);
      return;
    }
    router.push('/retro/result');
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="회고하기" backHref="/retro" />

      {/* 설문 영역 */}
      <div className="flex flex-1 flex-col gap-12.5 overflow-y-auto pb-36 pt-5">
        {/* Q1. 감정 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              오늘 소비를 이끈 감정은 무엇이였나요?
            </p>
            {submitted && !selectedEmotion && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ChipSelect
            options={EMOTIONS}
            selected={selectedEmotion}
            onChange={setSelectedEmotion}
          />
        </div>

        {/* Q2. 상황 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              어떤 상황에서 소비하게 됐나요?
            </p>
            {submitted && !selectedSituation && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ChipSelect
            options={SITUATIONS}
            selected={selectedSituation}
            onChange={setSelectedSituation}
          />
        </div>

        {/* Q3. 만족도 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              소비가 전반적으로 만족스러웠나요?
            </p>
            {submitted && !selectedSatisfaction && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ListSelect
            options={SATISFACTION}
            selected={selectedSatisfaction}
            onChange={setSelectedSatisfaction}
          />
        </div>

        {/* Q4. 내일 계획 */}
        <div className="flex flex-col gap-5">
          <div className="px-4">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              내일은 어떻게 소비하고 싶나요?
            </p>
            {submitted && !selectedPlan && (
              <p
                key={shakeKey}
                className="animate-shake text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#EB1C1C]"
              >
                항목을 선택해주세요
              </p>
            )}
          </div>
          <ListSelect
            options={TOMORROW_PLAN}
            selected={selectedPlan}
            onChange={setSelectedPlan}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center justify-center bg-white pt-6 pb-12.75 pl-4.25 pr-3.75">
        <button
          onClick={handleSubmit}
          className={`h-13.5 w-full rounded-[10px] text-[20px] font-semibold ${
            isAllSelected
              ? 'bg-[#13278A] text-white'
              : 'bg-[#E5E5E5] text-[#9FA4A8]'
          }`}
        >
          결과보기
        </button>
      </div>
    </div>
  );
}
