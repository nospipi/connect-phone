// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/create-new/page.tsx
import { createNewSalesChannel } from "@/app/(backend)/server_actions/sales-channels/createNewSalesChannel"
import { getUserLoggedInOrganization } from "@/app/(backend)/server_actions/users/getUserLoggedInOrganization"
import CreateSalesChannelLogoUpload from "./CreateSalesChannelLogoUpload"
import { RiArrowLeftLine, RiAddLine } from "@remixicon/react"
import Link from "next/link"

//----------------------------------------------------------------------

const Page = async ({
  //params,
  searchParams,
}: {
  //params: Promise<{ partner_id: string; page: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { logoUrl = "" } = await searchParams
  const loggedInOrganization = await getUserLoggedInOrganization()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
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

      {/* Form */}
      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="w-full max-w-3xl">
            <form
              action={createNewSalesChannel}
              className="flex flex-col gap-6"
            >
              {/* Channel Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Channel Name
                </label>
                <input
                  autoFocus
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Online Store, Retail Outlet, Mobile App"
                  //defaultValue={prefilledName}
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Choose a descriptive name for your sales channel
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe this sales channel and its purpose..."
                  //defaultValue={prefilledDescription}
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Provide additional details about this channel
                </p>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Channel Logo
                </label>
                <div className="mt-2">
                  <CreateSalesChannelLogoUpload
                    currentLogoUrl={logoUrl}
                    organizationId={loggedInOrganization?.id.toString() || ""}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Upload a logo to represent this sales channel
                </p>
              </div>

              {/* Hidden input for logo URL to be submitted with the form */}
              <input type="hidden" name="logoUrl" value={logoUrl} />

              {/* Active Status Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="mt-2">
                  <div className="flex items-center justify-between rounded-lg border border-gray-300 p-4 dark:border-gray-600 dark:bg-gray-800">
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
                        defaultChecked={false}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800"></div>
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Inactive channels can be activated later from the channels
                  list
                </p>
              </div>

              {/* Form Actions */}
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
                  <RiAddLine className="mr-2 h-4 w-4" />
                  Create Sales Channel
                </button>
              </div>
            </form>

            {/* Help Section */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
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
