'use client';

import { useFormattedDate } from '@/shared/hooks';

export function DateDisplay() {
  const today = new Date().toISOString();
  const formattedDate = useFormattedDate(today, {
    year: undefined,
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return <>{formattedDate}</>;
}
