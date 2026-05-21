import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundProvider from './BackgroundProvider';
import { QueryProvider } from '@/shared/lib/QueryProvider';
import { KakaoScript } from '@/shared/lib/KakaoScript';
import { GoogleScript } from '@/shared/lib/GoogleScript';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feel-Log",
  description: "감정에 따른 소비 패턴을 분석하고 추적하는 웹 앱",
  manifest: "/manifest.json",
  applicationName: "Feel-Log",
  appleWebApp: {
    capable: true,
    title: "Feel-Log",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Feel-Log",
    description: "감정에 따른 소비 패턴을 분석하고 추적하는 웹 앱",
    url: "https://feellog.xyz",
    siteName: "Feel-Log",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Feel-Log",
    description: "감정에 따른 소비 패턴을 분석하고 추적하는 웹 앱",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#13278A",
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
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="bg-gray-50 select-none" suppressHydrationWarning>
        <KakaoScript />
        <GoogleScript />
        <BackgroundProvider>
          {children}
        </BackgroundProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
