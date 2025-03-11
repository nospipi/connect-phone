import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import { siteConfig } from "./siteConfig"
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { ToastContainer } from "react-toastify"
import "./globals.css"

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
      name: "Vaggelis Magonezos",
      url: "",
    },
  ],
  creator: "Vaggelis Magonezos",
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

//---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorBackground: "#111828" },
        elements: {
          input: "text-black text-sm",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className="overflow-hidden">
        <body
          className={`${inter.className} overflow-hidden antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
          suppressHydrationWarning
        >
          <ThemeProvider defaultTheme="dark" attribute="class">
            <SignedIn>{children}</SignedIn>
            <SignedOut>{children}</SignedOut>
          </ThemeProvider>
          <ToastContainer position="bottom-right" limit={1} />
        </body>
      </html>
    </ClerkProvider>
  )
}
