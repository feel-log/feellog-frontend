"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/shared/ui';
import Footer from '@/shared/ui/Footer';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import HouseHoldBoxSkeleton from '@/widgets/house-hold/HouseHoldBoxSkeleton';
import { HouseHoldDim } from '@/widgets/house-hold/HouseHoldDim';
import { useToken } from '@/shared/store';
import { useIsMounted } from '@/shared/hooks';




const HouseHoldWrapper = dynamic(() => import('@/widgets/house-hold/HouseHoldWrapper'), {
  loading: () => <HouseHoldBoxSkeleton />,
});

function HomeContent() {
  const [isDimmed, setIsDimmed] = useState<boolean>(false);
  const [isBoxOn, setIsBoxOn] = useState<boolean>(false);
  const [isSecondBoxOn, setIsSecondBoxOn] = useState<boolean>(false);

  useEffect(() => {
    const isDimShowed = localStorage.getItem('isDimShowed');
    if (!isDimShowed) {
      setIsDimmed(true);
      localStorage.setItem('isDimShowed', 'true');
    } else {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove('hiddens');
    }
  },[])

  const { isLoaded } = useToken();
  const isMounted = useIsMounted();

  const isLoading = !isMounted || !isLoaded;
  

  return (
    <>
      <FullScreenLoader isLoading={isLoading} />
      <div className={isLoading ? 'pointer-events-none' : ''}>
        <div className="main__content__wrapper">
          <HouseHoldDim isRendered={isDimmed} changeFalse={() => setIsDimmed(false)} boxOn={() => setIsBoxOn(true)} boxOff={() => setIsBoxOn(false)} secondBoxOn={() => setIsSecondBoxOn(true)} secondBoxOff={() => setIsSecondBoxOn(false)} />
          <Header />
          <HouseHoldWrapper isBoxOn={isBoxOn} secondBoxOn={isSecondBoxOn} />
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
