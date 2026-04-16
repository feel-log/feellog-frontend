'use client';

import React from 'react';
import { Header } from '@/shared/ui';
import HouseHoldWrapper from '@/widgets/house-hold/HouseHoldWrapper';
import { ClientOnly } from '@/shared/ui';

export default function Home() {
  return (
    <div className="main__content__wrapper">
      <ClientOnly>
        <Header />
        <HouseHoldWrapper />
      </ClientOnly>
    </div>
  );
}
