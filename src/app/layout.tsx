import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import BackgroundProvider from './BackgroundProvider';
import { QueryProvider } from '@/shared/lib/QueryProvider';
import { KakaoScript } from '@/shared/lib/KakaoScript';
import { GoogleScript } from '@/shared/lib/GoogleScript';
import { Header } from '@/shared/ui';
import StatusBar from '@/shared/ui/StatusBar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Feel-Log",
  description: "감정에 따른 소비 패턴을 분석하고 추적하는 웹 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html
        lang="ko"
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="bg-gray-50 select-none" suppressHydrationWarning>
        <KakaoScript />
        <GoogleScript />
        <BackgroundProvider>
          <StatusBar />
          {children}
        </BackgroundProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
