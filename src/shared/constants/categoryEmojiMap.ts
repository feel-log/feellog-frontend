export const CATEGORY_EMOJI_MAP: Record<string, string> = {
  식비: '🍔',
  카페: '☕',
  생필품: '🧼',
  의류: '👚',
  교통비: '🚌',
  의료: '🏥',
  교육: '✏️',
  경조사: '🎉',
  공과금: '💸',
  주거: '🏠',
  보험료: '📄',
  저축: '💰',
  취미: '🎨',
  뷰티: '💅',
  문화생활: '🎭',
};

export function getCategoryEmoji(name: string): string {
  return CATEGORY_EMOJI_MAP[name] ?? '📌';
}
