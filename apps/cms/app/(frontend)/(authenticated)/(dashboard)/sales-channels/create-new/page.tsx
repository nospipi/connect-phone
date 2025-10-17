// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/create-new/page.tsx

import { createNewSalesChannel } from "@/app/(backend)/server_actions/sales-channels/createNewSalesChannel"
import { getUserLoggedInOrganization } from "@/app/(backend)/server_actions/users/getUserLoggedInOrganization"
import { getMediaById } from "@/app/(backend)/server_actions/media/getMediaById"
import LogoSection from "./LogoSection.client"
import { RiArrowLeftLine, RiAddLine } from "@remixicon/react"
import Link from "next/link"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

const Page = async ({ searchParams }: PageProps) => {
  const searchParamsData = await searchParams
  const loggedInOrganization = await getUserLoggedInOrganization()

  const name = searchParamsData.name || ""
  const description = searchParamsData.description || ""
  const isActive = searchParamsData.isActive === "on"

  let logoId: number | null = null
  if (searchParamsData.logoId === "") {
    logoId = null
  } else if (searchParamsData.logoId) {
    logoId = parseInt(searchParamsData.logoId, 10)
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
    <div className="flex h-full flex-col overflow-hidden">
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
              Create New Sales Channel
            </h1>
            <p className="text-sm text-gray-500">
              Add a new sales channel to {loggedInOrganization?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="w-full max-w-3xl">
            <form
              action={createNewSalesChannel}
              className="flex flex-col gap-6"
            >
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
                  className="mt-2 block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                  className="mt-2 block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Provide additional details about this channel
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Channel Logo
                </label>
                <LogoSection selectedLogo={selectedLogo} logoId={logoId} />
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Select a logo to represent this sales channel
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="mt-2">
                  <div className="flex items-center justify-between border border-gray-300 p-4 dark:border-gray-600 dark:bg-gray-800">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        Active Channel
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Channel will be available for use immediately after
                        creation
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={isActive}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Inactive channels can be activated later from the channels
                  list
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <PendingOverlay mode="navigation" href="/sales-channels">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </PendingOverlay>
                <PendingOverlay mode="form">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    <RiAddLine className="mr-2 h-4 w-4" />
                    Create Sales Channel
                  </button>
                </PendingOverlay>
              </div>
            </form>

            <div className="mt-6 bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                What are sales channels?
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                Sales channels represent different ways your organization sells
                products or services. Examples include online stores, physical
                retail locations, mobile apps, or partner networks. You can
                create inactive channels to prepare them for future use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
