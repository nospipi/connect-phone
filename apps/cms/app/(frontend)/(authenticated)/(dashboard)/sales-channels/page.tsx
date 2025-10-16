// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/page.tsx
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/sales-channels/getAllSalesChannelsOfOrganizationPaginated"
import SalesChannelItem from "./SalesChannelItem"
import { ISalesChannel } from "@connect-phone/shared-types"
import { RiAddLine } from "@remixicon/react"
import { Pagination } from "@/components/common/pagination/Pagination"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiNodeTree } from "@remixicon/react"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { page = "1", search = "", role = "all" } = params

  const salesChannelsResponse =
    await getAllSalesChannelsOfOrganizationPaginated({
      page: page,
    })
  const items: ISalesChannel[] = salesChannelsResponse?.items || []
  const meta = salesChannelsResponse?.meta

  return (
    <div className="relative flex h-full flex-col gap-3 pt-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
              Sales Channels
            </h1>
            <p className="mt-1 hidden text-sm text-gray-500 sm:flex">
              Manage your organization&apos;s sales channels and distribution
              networks
            </p>
          </div>
          <Link href="/sales-channels/create-new">
            <Button variant="primary" className="gap-2">
              <RiAddLine />
              <span>Create New Channel</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
                <RiNodeTree className="h-8 w-8 text-gray-400 dark:text-slate-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
                No sales channels found
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-500">
                Get started by creating your first sales channel
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 px-5 dark:divide-slate-800/30">
            {items.map((channel: ISalesChannel) => (
              <SalesChannelItem key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        meta={meta}
        searchParams={params}
        itemLabel="sales channels"
      />
    </div>
  )
}

export default Page
