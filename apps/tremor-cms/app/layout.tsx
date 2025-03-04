import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"
import { siteConfig } from "./siteConfig"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs"

import { Sidebar } from "@/components/ui/navigation/Sidebar"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [],
  authors: [
    {
      name: "yourname",
      url: "",
    },
  ],
  creator: "yourname",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={
        {
          //baseTheme: dark, //issues on input fields
        }
      }
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} overflow-y-scroll scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
          suppressHydrationWarning
        >
          <ThemeProvider defaultTheme="dark" attribute="class">
            <SignedIn>
              <Sidebar />
              <main className="lg:pl-72">{children}</main>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
