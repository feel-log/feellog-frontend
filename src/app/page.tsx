'use client';

import React from 'react';
import Header from '@/shared/ui/Header';
import { ClientOnly } from '@/shared/ui';

export default function Home() {
  return (
    <div className="main__content__wrapper">
      <ClientOnly>
        <Header />
      </ClientOnly>
    </div>
  );
}
