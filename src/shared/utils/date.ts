/**
 * 서버-클라이언트 안전한 날짜 유틸리티
 * 서버와 클라이언트 렌더링 불일치 방지
 */

/**
 * 로컬 timezone(KST) 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * `toISOString()`은 UTC 기준이라 KST 새벽 시간대에 어제 날짜가 나오는 버그 방지
 */
export function todayKST(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 서버-클라이언트 안전한 날짜 포맷팅
 * 서버에서는 ISO 문자열 반환, 클라이언트에서만 로컬 포맷 적용
 */
export function formatDateSafe(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * ISO 문자열을 한국어 형식으로 변환
 * 클라이언트에서만 안전하게 사용 가능
 */
export function formatToKorean(
  isoDate: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (typeof window === 'undefined') {
    return isoDate; // 서버에서는 원본 반환
  }

  const date = new Date(isoDate);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * 상대 시간 표시 (예: "2시간 전")
 * 클라이언트에서만 안전하게 사용 가능
 */
export function getRelativeTime(isoDate: string): string {
  if (typeof window === 'undefined') {
    return isoDate;
  }

  const date = new Date(isoDate);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) return '방금 전';
  if (diff < hour) return `${Math.floor(diff / minute)}분 전`;
  if (diff < day) return `${Math.floor(diff / hour)}시간 전`;
  if (diff < week) return `${Math.floor(diff / day)}일 전`;

  return formatToKorean(isoDate);
}

/**
 * 날짜 범위 생성 (서버에서도 안전)
 */
export function getDateRange(
  days: number
): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * 월의 첫날과 마지막날 반환
 */
export function getMonthRange(
  date: Date = new Date()
): { start: string; end: string } {
  const year = date.getFullYear();
  const month = date.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
