import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranchie Taxi Reviews - Customer Testimonials | St Vincent SVG",
  description: "Read reviews from satisfied customers of Ranchie Taxi. Award-winning service in St Vincent and the Grenadines. See why tourists trust us for airport transfers and tours.",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}