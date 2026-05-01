"use client";

import Image from 'next/image';

declare global {
  interface Window {
    Kakao: any;
  }
}

export function SocialLoginButton({ social,imageUrl, text, color, textColor }: { social:"kakao" | "google",imageUrl: string, text: string, color: string, textColor: string }) {

  const handleLoginButton = () => {
    if(social === "kakao") {
      console.log("kakao")
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:3000/oauth/kakao"
      })
    }
  }

  return (
    <button className={"w-3/4 py-4 px-5 rounded-[8px] flex items-center cursor-pointer"} style={{ backgroundColor: color}} onClick={handleLoginButton}>
      <Image src={imageUrl} alt={text} width={20} height={20} />
      <span className={"absolute left-1/2 -translate-x-1/2 text-[13px]"} style={{ color: textColor }}>{text}</span>
    </button>
  )
}