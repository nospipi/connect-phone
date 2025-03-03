import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Providers from "./Providers.client";
import "./globals.css";
const montserrat = Montserrat({
  weight: "500",
  subsets: ["latin"],
});

//------------------------------------------------

export const metadata: Metadata = {
  title: "ConnectPhone CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
