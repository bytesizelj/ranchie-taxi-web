import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ranchie Taxi - Your Trusted Ride in Paradise",
  description: "Reliable taxi service across Saint Vincent & the Grenadines. Airport transfers, island tours, and local transportation.",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ranchie Taxi",
  },
  openGraph: {
    title: "Ranchie Taxi - Your Trusted Ride in Paradise",
    description: "Reliable taxi service across Saint Vincent & the Grenadines",
    url: "https://ranchietaxi.com",
    siteName: "Ranchie Taxi",
    locale: "en_US",
    type: "website",
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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ranchie Taxi" />
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
      </head>
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
      <body className="font-sans text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}