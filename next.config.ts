import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// NEXT_PUBLIC_ 접두사를 쓰지 않으므로, 브라우저 번들에서 쓰는 값은
// 여기서 빌드 시점에 명시적으로 주입해야 한다. (비밀 키는 넣지 말 것)
const clientEnv = [
  "API_BASE_URL",
  "GOOGLE_CLIENT_ID",
  "KAKAO_APP_KEY",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_VAPID_KEY",
] as const;

const nextConfig: NextConfig = {
  env: Object.fromEntries(
    clientEnv
      .filter((key) => process.env[key] !== undefined)
      .map((key) => [key, process.env[key] as string]),
  ),
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 60,
    },
  },
  async headers() {
    return [
      {
        source: '/svg/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/:path*(svg|png|jpg|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default withBundleAnalyzer(nextConfig);
