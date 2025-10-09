import TabNavigationWrapper from "./TabNavigationWrapper.client"

//-------------------------------------------------------------------

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="relative flex h-full flex-col">
      <div className="pl-5 pt-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Inventory
        </h1>
        <TabNavigationWrapper />
      </div>
      {children}
    </div>
  )
}

export default Layout
