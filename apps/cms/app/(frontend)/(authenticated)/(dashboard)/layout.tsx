import DesktopSidebar from "@/components/ui/navigation/DesktopSidebar"
import MobileNavbar from "@/components/ui/navigation/MobileNavbar"

//-------------------------------------------------------------------------------

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-screen min-h-screen flex-col overflow-hidden sm:flex-col lg:flex-row">
      <div className="hidden lg:flex">
        <DesktopSidebar />
      </div>
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </main>
  )
}
