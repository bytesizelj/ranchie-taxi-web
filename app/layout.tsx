import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  themeColor: '#ffffff',
};
export const metadata: Metadata = {
  title: "Ranchie Taxi SVG - Airport Transfers & Island Tours | St Vincent",
  description: "Award-winning taxi service in Saint Vincent and the Grenadines. Airport transfers from Argyle, Bequia ferry connections, island tours, and 24/7 transportation. Book your reliable SVG taxi today!",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  keywords: "taxi st vincent, airport taxi svg, argyle airport transfer, bequia taxi, st vincent island tour, svg taxi service, kingstown taxi, grenadines taxi, ranchie taxi",
  authors: [{ name: "Ranchie Taxi" }],
  robots: "index, follow",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ranchie Taxi",
  },
  openGraph: {
    title: "Ranchie Taxi - #1 Taxi Service in St Vincent & the Grenadines",
    description: "Award-winning taxi service with 24+ years experience. Airport transfers, island tours, Bequia connections. Book now!",
    url: "https://ranchie-taxi-web.vercel.app",
    siteName: "Ranchie Taxi SVG",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ranchie Taxi - St Vincent Airport Transfers & Tours",
    description: "Award-winning taxi service in SVG. Airport pickups, island tours, Bequia ferry transfers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://ranchie-taxi-web.vercel.app" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ranchie Taxi" />
        <meta name="geo.region" content="VC" />
        <meta name="geo.placename" content="Saint Vincent and the Grenadines" />
        {/* Preload critical assets */}
        <link rel="preload" href="/videos/ranchie-taxi-award.mp4" as="video" />
        <link rel="preload" href="/images/pirates-rock.png" as="image" />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7C6G3KZ8K1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7C6G3KZ8K1');
            `,
          }}
        />
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}