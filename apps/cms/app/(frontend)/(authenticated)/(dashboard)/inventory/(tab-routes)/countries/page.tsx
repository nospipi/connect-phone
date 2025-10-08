// apps/cms/app/(frontend)/(authenticated)/(dashboard)/countries/(tab-routes)/countries/page.tsx
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiUser2Fill, RiSearchLine } from "@remixicon/react"
import { getAllCountriesOfOrg } from "@/app/(backend)/server_actions/getAllCountriesOfOrg"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { countryName = "" } = await searchParams

  const countries = await getAllCountriesOfOrg({
    countryName: countryName,
  })

  const hasActiveFilters = countryName !== ""

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden py-4 pl-5">
      {/* Filters Bar */}
      <div className="my-2 flex flex-col gap-3 pr-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <form
            method="GET"
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:max-w-lg sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
                </div>
                <input
                  autoFocus
                  type="text"
                  name="search"
                  placeholder="Search countries..."
                  defaultValue={countryName}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:justify-start">
              <Button
                type="submit"
                variant="secondary"
                className="border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
              >
                Apply
              </Button>
              {hasActiveFilters && (
                <Link href="/users/users">
                  <Button
                    variant="secondary"
                    className="border-red-300 bg-red-50 px-4 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                  >
                    Clear
                  </Button>
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {countries.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiUser2Fill className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No users found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {countryName !== "all"
                ? "Try adjusting your filters to see more results"
                : "There are no countries in your organization yet."}
            </p>
          </div>
        </div>
      )}

      {/* Users List */}
      {countries.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto pr-5 dark:divide-slate-800/30">
            {countries.map((country: any, index) => {
              return (
                <Link
                  key={country.id}
                  href={`/countries/${country.id}`}
                  className="block"
                >
                  <span>{country.code}</span>
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
