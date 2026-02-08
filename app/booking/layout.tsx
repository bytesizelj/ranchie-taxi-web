import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Taxi in St Vincent | Ranchie Taxi SVG - Airport Transfers",
  description: "Book your reliable taxi in St Vincent and the Grenadines. Airport pickups, Bequia transfers, island tours. Easy WhatsApp booking with instant confirmation.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}