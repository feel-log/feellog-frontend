export interface Insight {
  id: string;
  imageSrc: string;
}

export interface CategoryItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  chartColor?: string; 

}

export interface EmotionItem {
  rank: number;
  emoji: string;
  name: string;
  amount: number;
}

export interface SituationTag {
  rank: number;
  name: string;
}

export interface ReportData {
  income: number;
  expense: number;
  insights: Insight[];
  categorySummary: string;
  categories: CategoryItem[];
  emotionSummary: string;
  emotions: EmotionItem[];
  situationSummary: string;
  situations: SituationTag[];
}

export const reportMockData: ReportData = {
  income: 1_000_000,
  expense: 1_500_000,
  insights: [
    //임시
    { id: 'insight-1', imageSrc: '/implements/Frame 1597881824.svg' },
    { id: 'insight-2', imageSrc: '/implements/Frame 1597881825.svg' },
    { id: 'insight-3', imageSrc: '/implements/Frame 1597881826.svg' },
  ],
  categorySummary: '이번 달은 식비에 돈을 가장 많이 지출했어요',
  categories: [
    { name: '식비', amount: 592_000, percentage: 44, color: '#13278A' },
    { name: '경조사', amount: 254_000, percentage: 24, color: '#58E1B6' },
    { name: '의료', amount: 84_000, percentage: 16, color: '#FFDB72' },
    { name: '뷰티', amount: 42_000, percentage: 10, color: '#CACDD2' },
    { name: '교통', amount: 31_000, percentage: 6, color: '#F7F8FA' },
  ],
  emotionSummary: '심심할수록 무료함을 채우기 위한 소비가 늘었어요',
  emotions: [
    { rank: 1, emoji: '😔', name: '우울함', amount: 342_000 },
    { rank: 2, emoji: '😵', name: '충동', amount: 145_000 },
    { rank: 3, emoji: '😟', name: '불안함', amount: 95_000 },
    { rank: 3, emoji: '😫', name: '스트레스', amount: 32_000 },
    { rank: 3, emoji: '😢', name: '외로움', amount: 13_000 },
  ],
  situationSummary: '몸과 마음을 달래는 시간이 필요했던 한 달이었어요',
  situations: [
    { rank: 1, name: '피로 회복' },
    { rank: 2, name: '충동 소비' },
    { rank: 3, name: '기분 전환' },
    { rank: 4, name: '보상 심리' },
    { rank: 5, name: '할인' },
  ],
};
