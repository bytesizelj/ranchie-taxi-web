import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Ranchie Taxi - Award-Winning Driver in St Vincent | 24+ Years",
  description: "Meet Ranchie - SVG Tourism Authority's Most Compliant Taxi Driver 2023. Over 24 years serving St Vincent and the Grenadines. Reliable airport transfers and island tours.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}