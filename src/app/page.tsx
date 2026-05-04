'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Viewport } from 'next';
import { Header } from '@/shared/ui';
import Footer from '@/shared/ui/Footer';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import HouseHoldBoxSkeleton from '@/widgets/house-hold/HouseHoldBoxSkeleton';
import { useToken } from '@/shared/store';
import { useIsMounted } from '@/shared/hooks';

const HouseHoldWrapper = dynamic(() => import('@/widgets/house-hold/HouseHoldWrapper'), {
  loading: () => <HouseHoldBoxSkeleton />,
});

function HomeContent() {
  const { isLoaded } = useToken();
  const isMounted = useIsMounted();

  const isLoading = !isMounted || !isLoaded;

  return (
    <>
      <FullScreenLoader isLoading={isLoading} />
      <div className={isLoading ? 'pointer-events-none' : ''}>
        <div className="main__content__wrapper">
          <Header />
          <HouseHoldWrapper />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
