import React from 'react';
import { Header } from '@/shared/ui';
import HouseHoldWrapper from '@/widgets/house-hold/HouseHoldWrapper';
import Footer from '@/shared/ui/Footer';

export default function Home() {
  return (
    <div className="main__content__wrapper">
      <Header />
      <HouseHoldWrapper />
      <Footer />
    </div>
  );
}
