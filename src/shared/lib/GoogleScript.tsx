'use client';

import Script from 'next/script';

export function GoogleScript() {
  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
  );
}
