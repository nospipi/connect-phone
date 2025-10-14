// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/[sales_channel_id]/page.tsx
import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"
import { getSalesChannelById } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelById"
import { getMediaById } from "@/app/(backend)/server_actions/media/getMediaById"
import { updateSalesChannel } from "@/app/(backend)/server_actions/sales-channels/updateSalesChannel"
import LogoSection from "./LogoSection.client"
import DeleteSalesChannelButton from "./DeleteSalesChannelButton"

//----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ sales_channel_id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { sales_channel_id } = await params
  const searchParamsData = await searchParams

  const salesChannelData = await getSalesChannelById(Number(sales_channel_id))

  const name = searchParamsData.name || salesChannelData.name || ""
  const description =
    searchParamsData.description || salesChannelData.description || ""
  const isActive =
    searchParamsData.isActive !== undefined
      ? searchParamsData.isActive === "on"
      : salesChannelData.isActive

  let logoId: number | null = null
  if (searchParamsData.logoId === "") {
    logoId = null
  } else if (searchParamsData.logoId) {
    logoId = parseInt(searchParamsData.logoId, 10)
  } else {
    logoId = salesChannelData.logoId || null
  }

  let selectedLogo = null
  if (logoId) {
    try {
      selectedLogo = await getMediaById(logoId)
    } catch (error) {
      console.error("Failed to fetch logo media:", error)
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/sales-channels"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Edit Sales Channel
            </h1>
            <p className="text-sm text-gray-500">
              Update the sales channel information
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="flex w-full max-w-3xl flex-col gap-10">
            <form
              key={salesChannelData.id}
              action={updateSalesChannel}
              className="flex flex-1 flex-col gap-6"
            >
              <input type="hidden" name="id" value={salesChannelData.id} />
              <input type="hidden" name="logoId" value={logoId || ""} />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Channel Name *
                </label>
                <input
                  defaultValue={name}
                  autoFocus
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Online Store, Retail Outlet, Mobile App"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Choose a descriptive name for your sales channel
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  defaultValue={description}
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe this sales channel and its purpose..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Provide additional details about this channel
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Channel Logo
                </label>
                <LogoSection
                  selectedLogo={selectedLogo}
                  logoId={logoId}
                  salesChannelId={sales_channel_id}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Select a logo to represent this sales channel
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="mt-2">
                  <div
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      isActive
                        ? "border-green-200 bg-green-50/40 dark:border-green-800/50 dark:bg-green-900/10"
                        : "border-red-200 bg-red-50/40 dark:border-red-800/50 dark:bg-red-900/10"
                    }`}
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        Active Channel
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Channel will be available for use when active
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={isActive}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800"></div>
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Inactive channels can be activated later
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <Link
                  href="/sales-channels"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update Sales Channel
                </button>
              </div>
            </form>
            <DeleteSalesChannelButton salesChannel={salesChannelData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
