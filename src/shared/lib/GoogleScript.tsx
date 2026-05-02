import Script from 'next/script';

export function GoogleScript() {
  const handleLoad = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is not set');
      return;
    }
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}
