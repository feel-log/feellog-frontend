'use client';

import { ReactNode } from 'react';
import { useIsMounted } from '@/shared/hooks/useIsMounted';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 클라이언트에서만 렌더링되는 컴포넌트 래퍼
 * 브라우저 전용 API를 사용하는 자식 컴포넌트를 감싸서 Hydration 오류 방지
 *
 * 사용 예:
 * ```tsx
 * <ClientOnly fallback={<Skeleton />}>
 *   <ComponentUsingWindow />
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
