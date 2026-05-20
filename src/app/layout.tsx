import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindWell — Discovery Survey",
  description: "Help us build a better way to connect people with the right therapist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
