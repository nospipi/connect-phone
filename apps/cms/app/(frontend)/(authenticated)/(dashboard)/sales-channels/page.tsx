// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/page.tsx
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/sales-channels/getAllSalesChannelsOfOrganizationPaginated"
import SalesChannelItem from "./SalesChannelItem"
import { ISalesChannel } from "@connect-phone/shared-types"
import { RiAddLine } from "@remixicon/react"
import { Pagination } from "@/components/common/pagination/Pagination"
import { RiNodeTree } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { page = "1", search = "" } = params

  const salesChannelsResponse =
    await getAllSalesChannelsOfOrganizationPaginated({
      page: page,
      search: search,
    })
  const items: ISalesChannel[] = salesChannelsResponse?.items || []
  const meta = salesChannelsResponse?.meta

  const buildClearSearchUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("page", "1")
    return `/sales-channels?${urlParams.toString()}`
  }

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
          <PendingOverlay mode="navigation" href="/sales-channels/create-new">
            <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <RiAddLine />
              <span>Create New Channel</span>
            </button>
          </PendingOverlay>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2">
          <form id="search-form" className="flex flex-1 items-center gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search sales channels..."
              className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
            />
            <PendingOverlay mode="form-navigation" formId="search-form">
              <button
                type="submit"
                form="search-form"
                className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 focus:outline-none dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
              >
                Search
              </button>
            </PendingOverlay>
            {search && (
              <PendingOverlay mode="navigation" href={buildClearSearchUrl()}>
                <button
                  type="button"
                  className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 focus:outline-none dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                >
                  Clear
                </button>
              </PendingOverlay>
            )}
          </form>
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
                {search
                  ? "Try adjusting your search"
                  : "Get started by creating your first sales channel"}
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
