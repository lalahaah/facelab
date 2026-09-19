import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: 'FaceLab — 사진 한 장으로 알아보는 혈액형·나이·관상',
  description: 'AI가 브라우저에서 바로 분석해요. 사진은 저장되지 않습니다. 혈액형, 나이, 관상을 무료로 확인해보세요.',
  openGraph: {
    title: 'FaceLab — 사진 한 장으로 알아보는 혈액형·나이·관상',
    description: 'AI가 브라우저에서 바로 분석해요. 사진은 저장되지 않습니다. 혈액형, 나이, 관상을 무료로 확인해보세요.',
    url: 'https://facelab.app',
    siteName: 'FaceLab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FaceLab — 사진 한 장으로 알아보는 혈액형·나이·관상',
    description: 'AI가 브라우저에서 바로 분석해요. 사진은 저장되지 않습니다. 혈액형, 나이, 관상을 무료로 확인해보세요.',
  },
  metadataBase: new URL('https://facelab.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-paper font-body text-ink antialiased">
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
