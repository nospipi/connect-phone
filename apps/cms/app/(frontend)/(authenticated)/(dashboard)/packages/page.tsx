import { columns } from "@/components/ui/data-table/columns"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { usage } from "@/data/data"

const Page = () => {
  return (
    <div className="h-screen overflow-auto p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Packages
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <span>PACKAGES</span>
      </div>
    </div>
  )
}

export default Page
