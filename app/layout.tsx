import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ranchie Taxi - Your Trusted Ride in Paradise",
  description: "Reliable taxi service across Saint Vincent & the Grenadines. Airport transfers, island tours, and local transportation.",
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
      <body className="font-sans text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}