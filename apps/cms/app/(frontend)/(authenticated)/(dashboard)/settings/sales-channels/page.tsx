import { columns } from "@/components/ui/data-table/columns"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { usage } from "@/data/data"
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import CreateRandomButton from "./CreateRandomButton.client"
import { SalesChannel } from "@connect-phone/shared-types"

// export interface SalesChannel {
//   id: number
//   uuid: string
//   name: string
//   description: string | null
// }

const Page = async () => {
  // console.log("Fetching sales channels...")

  const salesChannels = await getAllSalesChannelsOfOrganizationPaginated({
    organizationId: 31, // Replace with actual organization ID
    page: 1,
    limit: 10,
  })

  return (
    <div className="h-screen overflow-auto p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Sales channels
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <span>Sales channels</span>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <CreateRandomButton />
      </div>
    </div>
  )
}

export default Page
