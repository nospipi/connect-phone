import { createNewSalesChannel } from "@/app/(backend)/server_actions/createNewSalesChannel"
import { getCurrentUserOrganization } from "@/app/server_actions"
import CreateSalesChannelButton from "./CreateSalesChannelButton.client"
import SalesChannelLogoUpload from "./SalesChannelLogoUpload.client"
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
  const organization = { id: 89, name: "Example Organization" }

  const resolvedSearchParams = await searchParams
  const prefilledName = resolvedSearchParams.name || ""
  const prefilledDescription = resolvedSearchParams.description || ""
  const prefilledLogoUrl = resolvedSearchParams.logoUrl || ""

  if (!organization || !organization.id) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
            No Organization Found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You need to be part of an organization to create sales channels.
          </p>
          <Link
            href="/create-organization"
            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Organization
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/settings/sales-channels"
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
              Add a new sales channel to {organization.name}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 items-center justify-items-center overflow-auto p-4">
        <div className="h-full max-w-2xl">
          <form action={createNewSalesChannel} className="flex flex-col gap-6">
            {/* Channel Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Channel Name *
              </label>
              <input
                autoFocus
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Online Store, Retail Outlet, Mobile App"
                defaultValue={prefilledName}
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
                defaultValue={prefilledDescription}
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
                <SalesChannelLogoUpload
                  currentName={prefilledName}
                  currentDescription={prefilledDescription}
                  currentLogoUrl={prefilledLogoUrl}
                  organizationId={organization.id.toString()}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Optional: Upload a logo to represent this sales channel
              </p>
            </div>

            {/* Hidden input for logo URL to be submitted with the form */}
            <input type="hidden" name="logoUrl" value={prefilledLogoUrl} />

            {/* Organization Info */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Organization
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                This channel will be created for{" "}
                <span className="font-medium">{organization.name}</span>
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
              <Link
                href="/settings/sales-channels"
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
              retail locations, mobile apps, or partner networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
