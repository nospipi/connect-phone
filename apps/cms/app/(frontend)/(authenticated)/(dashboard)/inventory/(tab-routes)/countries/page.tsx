// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/countries/page.tsx
import Link from "next/link"
import Image from "next/image"
import { RiSearchLine, RiMapPinLine } from "@remixicon/react"
import { getAllCountriesOfOrg } from "@/app/(backend)/server_actions/countries/getAllCountriesOfOrg"
import { CountryRegion } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const REGION_OPTIONS = [
  { value: "all", label: "All Regions" },
  ...Object.values(CountryRegion).map((region) => ({
    value: region,
    label: region.charAt(0).toUpperCase() + region.slice(1).toLowerCase(),
  })),
] as const

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { search = "", region = "all" } = await searchParams
  const countries = await getAllCountriesOfOrg(search, region)
  const hasActiveFilters = search !== "" || region !== "all"

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden pb-5">
      {/* Filters Bar */}
      <div className="my-2 flex flex-col gap-3 px-5 pr-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <form
            id="filter-form"
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
                </div>
                <input
                  autoFocus
                  type="text"
                  name="search"
                  placeholder="Search countries..."
                  defaultValue={search}
                  className="block w-full border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>

              <div className="flex-1">
                <select
                  name="region"
                  defaultValue={region}
                  className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
                >
                  {REGION_OPTIONS.map((regionOption) => (
                    <option key={regionOption.value} value={regionOption.value}>
                      {regionOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:justify-start">
              <PendingOverlay mode="form-navigation" formId="filter-form">
                <button
                  type="submit"
                  form="filter-form"
                  className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                >
                  Apply
                </button>
              </PendingOverlay>
              {hasActiveFilters && (
                <PendingOverlay mode="navigation" href="/inventory/countries">
                  <button
                    type="button"
                    className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                  >
                    Clear
                  </button>
                </PendingOverlay>
              )}
            </div>
          </form>
        </div>
      </div>

      {countries.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiMapPinLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No countries found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {search || region !== "all"
                ? "Try adjusting your filters to see more results"
                : "There are no countries in your organization yet."}
            </p>
          </div>
        </div>
      )}

      {/* Countries List */}
      {countries.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto p-5 dark:divide-slate-800/30">
            {countries.map((country: any) => {
              const flagUrl =
                country.flagAvatarUrl || country.flagProductImageUrl

              return (
                <Link
                  key={country.id}
                  href={`/inventory/countries/${country.id}`}
                  className="block"
                >
                  <div className="duration-2000 group py-4 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {flagUrl ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm group-hover:shadow-md">
                            <Image
                              src={flagUrl}
                              alt={`${country.name} flag`}
                              fill
                              sizes="35px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-semibold text-gray-700 shadow-sm group-hover:from-gray-300 group-hover:to-gray-400 group-hover:text-gray-800 dark:from-slate-700/60 dark:to-slate-800/60 dark:text-slate-200 dark:group-hover:from-slate-600/60 dark:group-hover:to-slate-700/60 dark:group-hover:text-slate-100">
                            {country.code?.toUpperCase() || "??"}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-slate-100">
                              {country.name}
                            </p>
                            <p className="truncate text-sm text-gray-600 group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-slate-300">
                              {country.code?.toUpperCase()}
                            </p>
                          </div>

                          <div className="ml-4 flex-shrink-0">
                            <Badge variant="neutral">
                              {country.region?.charAt(0).toUpperCase() +
                                country.region?.slice(1).toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
