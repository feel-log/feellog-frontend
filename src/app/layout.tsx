import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StatusBar from '@/shared/ui/StatusBar';

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
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen w-full bg-gray-50">
          <div className="mx-auto flex min-h-screen max-w-md flex-col bg-linear-to-b from-[#ecf2fb] to-[#f3f8ff]">
            <StatusBar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
