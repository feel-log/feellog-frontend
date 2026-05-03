'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Viewport } from 'next';
import { Header } from '@/shared/ui';
import Footer from '@/shared/ui/Footer';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import HouseHoldBoxSkeleton from '@/widgets/house-hold/HouseHoldBoxSkeleton';
import { useToken } from '@/shared/store';

const HouseHoldWrapper = dynamic(() => import('@/widgets/house-hold/HouseHoldWrapper'), {
  loading: () => <HouseHoldBoxSkeleton />,
});

function HomeContent() {
  const { isLoaded } = useToken();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoading = !isMounted || !isLoaded;

  console.log('HomeContent - isMounted:', isMounted, 'isLoaded:', isLoaded, 'isLoading:', isLoading);

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
