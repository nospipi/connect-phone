//apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/layout.tsx

import TabNavigationWrapper from "./TabNavigationWrapper.client"

//-------------------------------------------------------------------

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-col gap-2 pl-3 pr-3 pt-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Inventory
        </h1>

        <div className="flex items-center justify-between">
          <TabNavigationWrapper />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default Layout
