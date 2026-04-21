'use client';

import { useFormattedDate } from '@/shared/hooks';

export function DateDisplay() {
  const today = new Date().toISOString();
  const formattedDate = useFormattedDate(today, {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  });

  return <>{formattedDate}</>;
}
