'use client';

import { useState, useEffect } from 'react';

/**
 * 타임존 안전한 날짜 포맷팅
 * 서버에서는 ISO 문자열 반환, 클라이언트에서만 로컬 포맷 적용
 *
 * 사용 예:
 * ```tsx
 * const formatted = useFormattedDate(new Date(), {
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 * });
 * ```
 */
export function useFormattedDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const isoString = dateObj.toISOString();

  const [formatted, setFormatted] = useState(isoString);

  useEffect(() => {
    setFormatted(
      dateObj.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...options,
      })
    );
  }, [isoString, options]);

  return formatted;
}
