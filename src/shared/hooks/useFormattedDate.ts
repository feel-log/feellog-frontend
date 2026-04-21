'use client';

import { useState, useEffect, useMemo } from 'react';

/**
 * 타임존 안전한 날짜 포맷팅
 * 서버에서는 ISO 문자열 반환, 클라이언트에서만 로컬 포맷 적용
 *
 * 사용 예:
 * ```tsx
 * const formatted = useFormattedDate('2026-04-21', {
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 * });
 * ```
 */
export function useFormattedDate(
  date?: Date | string,
  options?: Intl.DateTimeFormatOptions
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const isoString = dateObj ? dateObj.toISOString() : new Date().toISOString();

  const [formatted, setFormatted] = useState(() => {
    // 서버에서도 사용자 친화적인 기본값 제공
    if (!dateObj) return '';
    return new Date(isoString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      ...options,
    });
  });

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    const dateToFormat = new Date(isoString);
    setFormatted(
      dateToFormat.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        ...options,
      })
    );
  }, [isoString, optionsKey]);

  return formatted;
}
