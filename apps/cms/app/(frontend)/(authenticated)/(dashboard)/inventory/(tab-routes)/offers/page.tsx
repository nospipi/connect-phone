// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/offers/page.tsx
import { getAllEsimOffersPaginated } from "@/app/(backend)/server_actions/esim-offers/getAllEsimOffersPaginated"
import { RiSmartphoneLine } from "@remixicon/react"
import { IEsimOffer } from "@connect-phone/shared-types"
import { Pagination } from "@/components/common/pagination/Pagination"
import Link from "next/link"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { page = "1", search = "" } = params

  const offersData = await getAllEsimOffersPaginated({
    page,
    search,
  })

  const { items, meta } = offersData

  const hasActiveFilters = search !== ""

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-hidden">
      <div className="my-2 flex items-center gap-2 px-5">
        <div className="relative min-w-[200px] flex-1">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search offers..."
            className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>

        <PendingOverlay
          mode="form-navigation"
          formId="search-form"
          href={`/inventory/offers?page=1&search=${search}`}
        >
          <button
            type="submit"
            className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
          >
            Apply
          </button>
        </PendingOverlay>

        {hasActiveFilters && (
          <PendingOverlay mode="navigation" href="/inventory/offers">
            <button
              type="button"
              className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
            >
              Clear
            </button>
          </PendingOverlay>
        )}
      </div>

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiSmartphoneLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No eSIM offers found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {hasActiveFilters
                ? "Try adjusting your search to see more results"
                : "Get started by creating your first eSIM offer"}
            </p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto px-5 dark:divide-slate-800/30">
            {items.map((offer: IEsimOffer) => (
              <Link
                key={offer.id}
                href={`/inventory/offers/${offer.id}`}
                className="block"
              >
                <div className="duration-2000 group py-4 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex-shrink-0 text-base font-medium text-gray-500 dark:text-slate-500">
                              #{offer.id}
                            </span>
                            <p className="min-w-0 flex-1 truncate text-base font-medium text-gray-900 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-slate-100">
                              {offer.title}
                            </p>
                          </div>
                          <p className="mt-1 truncate text-sm text-gray-600 group-hover:underline dark:text-slate-400">
                            {offer.dataInGb} GB • {offer.durationInDays} days
                          </p>
                          {offer.countries && offer.countries.length > 0 && (
                            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-slate-500">
                              {offer.countries.length}{" "}
                              {offer.countries.length === 1
                                ? "country"
                                : "countries"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Pagination meta={meta} searchParams={params} itemLabel="offers" />
    </div>
  )
}

export default Page
