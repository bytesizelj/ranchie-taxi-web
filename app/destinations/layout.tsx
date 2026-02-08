import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Destinations - Island Tours & Day Trips | Ranchie Taxi",
  description: "Explore St Vincent and the Grenadines with Ranchie Taxi. Tours to La Soufriere volcano, Bequia, Young Island, Dark View Falls, Kingstown, and more.",
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}