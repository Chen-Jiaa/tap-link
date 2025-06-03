import type { Metadata } from "next";

import "../globals.css";

import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  description: "Redirecting you to the way",
  title: "Redirecting...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
