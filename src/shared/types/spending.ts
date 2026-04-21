export type EmotionType = '고마움' | '심심함' | '스트레스' | '짜증' | '충동' | '피곤함';

export interface Emotion {
  id: string;
  name: EmotionType;
  emoji: string;
  color: string;
}

export interface SpendingItem {
  id: string;
  category: string;
  amount: number;
  emotions: Emotion[];
  date: Date;
}

export interface DailySpending {
  date: Date;
  items: SpendingItem[];
  totalAmount: number;
}
