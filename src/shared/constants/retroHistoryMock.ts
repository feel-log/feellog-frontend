export interface RetroHistoryItem {
  id: number;
  title: {
    prefixText: string;
    highlightText: string;
    suffixText: string;
  };
  options: {
    situationTagName: string;
    satisfactionScore: number;
    nextActionOptionText: string;
  };
  result: {
    feedbackTitle: string;
    feedbackText: string;
    guideTitle: string;
    guideItems: string[];
  };
}

export interface RetroHistoryEntry {
  date: string;
  items: RetroHistoryItem[];
}

const SAMPLE_ITEM: RetroHistoryItem = {
  id: 1,
  title: {
    prefixText: '나를 위한 보상보다 ',
    highlightText: '아쉬움',
    suffixText: '이 더 컸던 오늘',
  },
  options: {
    situationTagName: '보상 심리',
    satisfactionScore: 2,
    nextActionOptionText: '지출 줄이기',
  },
  result: {
    feedbackTitle: '이런 점을 바꿔보면 어떨까요?',
    feedbackText:
      '보상 심리는 자연스러운 감정이에요\n힘든 날 나를 챙기고 싶은 마음은 당연하니까요\n다만, 미리 "보상 예산"을 정해두면 쓰고 나면\n아쉬움 대신 뿌듯함이 남을 거예요!',
    guideTitle: '보상 심리가 생길 땐 이렇게 해보세요',
    guideItems: [
      '월 보상 예산 설정하기',
      '바로 사지 않고 하루 뒤에 다시 생각해보기',
      '진짜 원하는 건지 스스로 되물어보기',
    ],
  },
};

export const RETRO_HISTORY_MOCK: RetroHistoryEntry[] = [
  { date: '2026-05-01', items: [{ ...SAMPLE_ITEM, id: 11 }] },
  { date: '2026-05-09', items: [{ ...SAMPLE_ITEM, id: 21 }] },
  { date: '2026-05-14', items: [{ ...SAMPLE_ITEM, id: 31 }] },
  {
    date: '2026-05-17',
    items: [
      { ...SAMPLE_ITEM, id: 41 },
      { ...SAMPLE_ITEM, id: 42, options: { ...SAMPLE_ITEM.options, satisfactionScore: 4 } },
      { ...SAMPLE_ITEM, id: 43, options: { ...SAMPLE_ITEM.options, satisfactionScore: 5 } },
    ],
  },
  {
    date: '2026-05-24',
    items: [
      { ...SAMPLE_ITEM, id: 51 },
      { ...SAMPLE_ITEM, id: 52, options: { ...SAMPLE_ITEM.options, satisfactionScore: 3 } },
    ],
  },
];

export function getRetroHistoryByDate(date: string): RetroHistoryItem[] {
  return RETRO_HISTORY_MOCK.find((entry) => entry.date === date)?.items ?? [];
}

export function getRetroHistoryDates(): string[] {
  return RETRO_HISTORY_MOCK.map((entry) => entry.date);
}
