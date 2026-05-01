"use client";

import Script from 'next/script';

export function KakaoScript() {
  const handleLoad = () => {
    if(window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
      console.log("카카오 SDK 초기화 완료: ", window.Kakao.isInitialized())
    }
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive" // 페이지 로드 후 실행
      onLoad={handleLoad} // 로드 완료 후 init
    ></Script>
  );
}