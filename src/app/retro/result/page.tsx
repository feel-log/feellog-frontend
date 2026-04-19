'use client';

import { useRouter } from 'next/navigation';

export default function RetroResultPage() {
  const router = useRouter();
  // 임시 더미 데이터 (추후 설문 응답에서 전달)
  const resultData = {
    title: '나를 위한 보상보다 아쉬움이 더 컸던 오늘',
    reason: '보상 심리',
    satisfaction: 2,
    resolution: '지출 줄이기',
    feedback: {
      message:
        '보상 심리는 자연스러운 감정이에요\n힘든 날 나를 챙기고 싶은 마음은 당연하니까요\n다만 미리 "보상 예산"을 정해두면 쓰고 나면 아쉬움 대신\n뿌듯함이 남을 거예요!',
      actionTitle: '보상 심리가 생길 땐 이렇게 해보세요',
      actions: [
        '월 보상 예산 설정하기',
        '바로 사지 않고 하루 뒤에 다시 생각해보기',
        '진짜 원하는 건지 스스로 되물어보기',
      ],
    },
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 헤더 */}
      <header className="flex h-14 items-center justify-between px-4">
        <div className="w-7" />
        <h1 className="text-[20px] font-semibold text-[#030303]">회고 결과</h1>
        <button onClick={() => router.push('/retro')}>
          <img src="/icons/icon_X.svg" alt="닫기" width={28} height={28} />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center gap-13.5 px-4 pt-8">
        {/* 결과 요약 카드 */}
        <div className="flex w-full flex-col gap-4 rounded-xl bg-[#F7F8FA] p-4">
          <p className="text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#030303]">
            {resultData.title}
          </p>
          <div className="flex flex-col gap-2">

            <div className="flex items-center gap-2.5">
              <p className="w-18.75 text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                소비 이유:
              </p>
              <p className="text-[14px] font-semibold leading-normal tracking-[-0.35px] text-[#030303]">
                {resultData.reason}
              </p>
            </div>
    
            <div className="flex items-center gap-2.5">
              <p className="w-[75px] text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                만족도:
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="20" height="20" viewBox="0 0 20 19" fill="none">
                    <path
                      d="M9.51074 0L11.7559 6.90983H19.0213L13.1435 11.1803L15.3886 18.0902L9.51074 13.8197L3.63289 18.0902L5.87803 11.1803L0.000177383 6.90983H7.2656L9.51074 0Z"
                      fill={star <= resultData.satisfaction ? '#13278A' : '#E5E5E5'}
                    />
                  </svg>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <p className="w-18.75 text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                내일의 다짐:
              </p>
              <p className="text-[14px] font-semibold leading-normal tracking-[-0.35px] text-[#030303]">
                {resultData.resolution}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center gap-1 px-0">
            <span className="text-[20px]">💡</span>
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              이런 점을 바꿔보면 어떨까요?
            </p>
          </div>

          <div className="flex w-full flex-col gap-6.75 rounded-[10px] bg-[#F7F8FA] p-4">
            {/* 피드백 메시지 */}
            <p className="whitespace-pre-line text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#1C1D1F]">
              {resultData.feedback.message}
            </p>

            {/* 액션 리스트 */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#030303]">
                {resultData.feedback.actionTitle}
              </p>
              <div className="flex flex-col gap-1.5">
                {resultData.feedback.actions.map((action) => (
                  <div key={action} className="flex items-center gap-1">
                    <img src="/icons/icon_check.svg" alt="체크" width={15} height={15} />
                    <p className="text-[14px] font-semibold leading-normal tracking-[-0.35px] text-[#030303]">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
