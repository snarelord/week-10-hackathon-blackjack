import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackjack",
  description: "Created by The Container Cre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
