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
        '보상 심리는 자연스러운 감정이에요\n힘든 날 나를 챙기고 싶은 마음은 당연하니까요\n다만, 미리 "보상 예산"을 정해두면 쓰고 나면\n아쉬움 대신 뿌듯함이 남을 거예요!',
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

      <div className="flex flex-col gap-10 pb-25 pl-3.75 pr-4 pt-5">
        {/* 섹션 1: 타이틀 + 결과 카드 */}
        <div className="flex flex-col gap-5">
          {/* 타이틀 */}
          <p className="text-[22px] font-bold leading-normal tracking-[-0.55px] text-[#1C1D1F]">
            나를 위한 보상보다
            <br />
            <span className="text-[#13278A]">아쉬움</span>이 더 컸던 오늘
          </p>

          {/* 결과 요약 카드 */}
          <div
            className="flex h-30 w-89.75 flex-col gap-1.5 rounded-xl p-4"
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
                {resultData.reason}
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
                      fill={star <= resultData.satisfaction ? '#13278A' : '#CACDD2'}
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
                {resultData.resolution}
              </p>
            </div>
          </div>
        </div>

        {/* 섹션 2: 💡 + 피드백 박스 */}
        <div className="flex w-full flex-col gap-3.75">
          <div className="flex items-center gap-1">
            <span className="text-[20px]">💡</span>
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              이런 점을 바꿔보면 어떨까요?
            </p>
          </div>
          <div className="h-30 w-89.75 rounded-xl bg-[#F7F8FA] p-4">
            <p className="whitespace-pre-line text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#27282C]">
              {resultData.feedback.message}
            </p>
          </div>
        </div>

        {/* 섹션 3: 📋 + 액션 박스 */}
        <div className="flex w-full flex-col gap-3.75">
          <div className="flex items-center gap-1">
            <span className="text-[20px]">📋</span>
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#030303]">
              {resultData.feedback.actionTitle}
            </p>
          </div>
          <div className="flex h-30 w-89.75 flex-col gap-3 rounded-xl bg-[#F7F8FA] p-4">
            {resultData.feedback.actions.map((action) => (
              <div key={action} className="flex items-center gap-1.5">
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
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
