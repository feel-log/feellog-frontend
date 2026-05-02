'use client';

import Script from 'next/script';

export function KakaoScript() {
  const handleLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }
  };

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js" // 레거시 SDK
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}
