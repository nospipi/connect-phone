import { Sidebar } from "@/components/ui/navigation/Sidebar"
import { headers } from "next/headers"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path")

  console.log("pathname", pathname)

  return (
    <>
      <Sidebar />
      <main className="overflow-hidden lg:pl-72">{children}</main>
    </>
  )
}
