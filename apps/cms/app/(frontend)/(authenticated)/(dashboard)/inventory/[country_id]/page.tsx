// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/countries/[country_id]/page.tsx
import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"
import { getCountryById } from "@/app/(backend)/server_actions/getCountryById"
import { updateCountry } from "@/app/(backend)/server_actions/updateCountry"
import { getUserLoggedInOrganization } from "@/app/(backend)/server_actions/getUserLoggedInOrganization"
import UpdateCountryFlagUpload from "./UpdateCountryFlagUpload.client"

//----------------------------------------------------------------------

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ country_id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { country_id } = await params
  const { flagAvatarUrl, flagProductImageUrl } = await searchParams

  const countryData = await getCountryById(Number(country_id))
  const loggedInOrganization = await getUserLoggedInOrganization()

  // Use URLs from searchParams if available, otherwise use existing URLs
  let currentFlagAvatarUrl =
    flagAvatarUrl === "clear"
      ? ""
      : flagAvatarUrl || countryData?.flagAvatarUrl || ""
  let currentFlagProductImageUrl =
    flagProductImageUrl === "clear"
      ? ""
      : flagProductImageUrl || countryData?.flagProductImageUrl || ""

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/inventory/countries"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Edit Country
            </h1>
            <p className="text-sm text-gray-500">
              Update the country flag images
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="flex w-full max-w-3xl flex-col gap-10">
            <form action={updateCountry} className="flex flex-1 flex-col gap-6">
              {/* Hidden ID Field */}
              <input type="hidden" name="id" value={countryData.id} />

              {/* Hidden inputs for flag URLs to be submitted with the form */}
              <input
                type="hidden"
                name="flagAvatarUrl"
                value={currentFlagAvatarUrl}
              />
              <input
                type="hidden"
                name="flagProductImageUrl"
                value={currentFlagProductImageUrl}
              />

              {/* Country Info (Read-only) */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {countryData.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country Code
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {countryData.code.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Region
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {countryData.region.charAt(0).toUpperCase() +
                        countryData.region.slice(1).toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Avatar Flag Upload (56x42) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Avatar Flag (56x42px)
                </label>
                <div className="mt-2">
                  <UpdateCountryFlagUpload
                    currentFlagUrl={currentFlagAvatarUrl}
                    organizationId={loggedInOrganization?.id.toString() || ""}
                    countryId={countryData.id.toString()}
                    flagType="avatar"
                    requiredDimensions={{ width: 56, height: 42 }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Small flag image for avatars and compact displays (56x42
                  pixels, Max 1MB)
                </p>
              </div>

              {/* Product Flag Upload (192x144) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Flag (192x144px)
                </label>
                <div className="mt-2">
                  <UpdateCountryFlagUpload
                    currentFlagUrl={currentFlagProductImageUrl}
                    organizationId={loggedInOrganization?.id.toString() || ""}
                    countryId={countryData.id.toString()}
                    flagType="product"
                    requiredDimensions={{ width: 192, height: 144 }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Larger flag image for product displays (192x144 pixels, Max
                  1MB)
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <Link
                  href="/inventory/countries"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update Country
                </button>
              </div>
            </form>
            {/* <DeleteCountryButton country={countryData} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
