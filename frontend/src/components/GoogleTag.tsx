'use client';
import Script from 'next/script';

export default function GoogleTag() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Guard against missing ID (helps in dev)
  if (!gaId) return null;

  return (
    <>
      {/* Load the gtag.js script */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Initialise dataLayer & config */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}