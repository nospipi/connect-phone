import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import { SalesChannel } from "@connect-phone/shared-types"

//---------------------------------------------------------------------------

const Page = async (
  {
    //params,
    //searchParams,
  }: {
    //params: Promise<{ partner_id: string; page: string }>
    //searchParams: Promise<{ [key: string]: string | undefined }>
  },
) => {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      CREATE NEW
    </div>
  )
}

export default Page
