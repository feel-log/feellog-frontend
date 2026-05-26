/**
 * 서버-클라이언트 안전한 날짜 유틸리티
 * 서버와 클라이언트 렌더링 불일치 방지
 */

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 로컬 timezone(KST) 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * `toISOString()`은 UTC 기준이라 KST 새벽 시간대에 어제 날짜가 나오는 버그 방지
 */
export function todayKST(): string {
  return formatDateString(new Date());
}
