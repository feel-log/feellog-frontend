'use client';

import { useEffect, useState } from 'react';

/**
 * 컴포넌트가 클라이언트에서 마운트되었는지 확인
 * Hydration 문제 해결을 위해 사용
 *
 * 사용 예:
 * ```tsx
 * const isMounted = useIsMounted();
 * if (!isMounted) return <Skeleton />;
 * return <ClientOnlyComponent />;
 * ```
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
