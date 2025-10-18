// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/[price_id]/page.tsx
import { getSalesChannelById } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelById"
import { getDateRangeById } from "@/app/(backend)/server_actions/date-ranges/getDateRangeById"
import { updatePrice } from "@/app/(backend)/server_actions/prices/updatePrice"
import { getPriceById } from "@/app/(backend)/server_actions/prices/getPriceById"
import Link from "next/link"
import { RiArrowLeftLine, RiCloseLine } from "@remixicon/react"
import { Currency } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import DateBasedCheckbox from "./DateBasedCheckbox.client"
import SalesChannelSelectButton from "./SalesChannelSelectButton.client"
import DateRangeSelectButton from "./DateRangeSelectButton.client"
import DeletePriceButton from "./DeletePriceButton"
import ResetButton from "./ResetButton.client"

//------------------------------------------------------------

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ price_id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { price_id } = await params
  const urlParams = await searchParams

  const price = await getPriceById(Number(price_id))

  const salesChannelIds = urlParams.salesChannelIds || ""
  const dateRangeIds = urlParams.dateRangeIds || ""
  const isDateBased =
    urlParams.isDateBased !== undefined
      ? urlParams.isDateBased === "true"
      : price.isDateBased
  const name = urlParams.name || price.name
  const amount = urlParams.amount || price.amount.toString()
  const currency = (urlParams.currency || price.currency) as Currency

  const selectedSalesChannelIds = salesChannelIds
    ? salesChannelIds.split(",").map(Number).filter(Boolean)
    : price.salesChannels.map((sc) => sc.id)

  const selectedDateRangeIds = dateRangeIds
    ? dateRangeIds.split(",").map(Number).filter(Boolean)
    : price.dateRanges?.map((dr) => dr.id) || []

  const selectedSalesChannels = await Promise.all(
    selectedSalesChannelIds.map((id) => getSalesChannelById(id)),
  )

  const selectedDateRanges = await Promise.all(
    selectedDateRangeIds.map((id) => getDateRangeById(id)),
  )

  const buildUrlWithoutItem = (
    field: "salesChannelIds" | "dateRangeIds",
    idToRemove: number,
  ) => {
    const newParams = new URLSearchParams()

    if (field === "salesChannelIds") {
      const remaining = selectedSalesChannelIds.filter(
        (id) => id !== idToRemove,
      )
      if (remaining.length > 0) {
        newParams.set("salesChannelIds", remaining.join(","))
      }
      if (dateRangeIds) newParams.set("dateRangeIds", dateRangeIds)
    } else {
      const remaining = selectedDateRangeIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        newParams.set("dateRangeIds", remaining.join(","))
      }
      if (salesChannelIds) newParams.set("salesChannelIds", salesChannelIds)
    }

    if (isDateBased) newParams.set("isDateBased", "true")
    if (name) newParams.set("name", name)
    if (amount) newParams.set("amount", amount)
    if (currency) newParams.set("currency", currency)

    return `/inventory/prices/${price_id}?${newParams.toString()}`
  }

  const buildInitialUrl = () => {
    const resetParams = new URLSearchParams()

    resetParams.set("name", price.name)
    resetParams.set("amount", price.amount.toString())
    resetParams.set("currency", price.currency)
    resetParams.set("isDateBased", price.isDateBased.toString())

    if (price.salesChannels && price.salesChannels.length > 0) {
      const salesChannelIds = price.salesChannels.map((sc) => sc.id).join(",")
      resetParams.set("salesChannelIds", salesChannelIds)
    }

    if (price.dateRanges && price.dateRanges.length > 0) {
      const dateRangeIds = price.dateRanges.map((dr) => dr.id).join(",")
      resetParams.set("dateRangeIds", dateRangeIds)
    }

    return `/inventory/prices/${price_id}?${resetParams.toString()}`
  }

  const priceForDelete = {
    id: Number(price_id),
    name: name || "Price",
  }

  const formKey = `${name}-${amount}-${currency}-${isDateBased}-${selectedSalesChannelIds.join(",")}-${selectedDateRangeIds.join(",")}`

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/inventory/prices"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Edit Price
            </h1>
            <p className="text-sm text-gray-500">
              Update the price information
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="flex w-full max-w-3xl flex-col gap-10">
            <form
              //key={formKey}
              action={updatePrice}
              className="flex flex-1 flex-col gap-6"
            >
              <input type="hidden" name="id" value={price_id} />
              <input
                type="hidden"
                name="salesChannelIds"
                value={JSON.stringify(selectedSalesChannelIds)}
              />
              <input
                type="hidden"
                name="isDateBased"
                value={isDateBased ? "true" : "false"}
              />
              <input
                type="hidden"
                name="dateRangeIds"
                value={JSON.stringify(selectedDateRangeIds)}
              />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={name}
                  placeholder="e.g., Standard Rate, Premium Package, Weekend Special"
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                  Choose a descriptive name for your price
                </p>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  step="0.01"
                  min="0"
                  defaultValue={amount}
                  placeholder="0.00"
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  id="currency"
                  name="currency"
                  required
                  defaultValue={currency}
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
                >
                  {Object.values(Currency).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <DateBasedCheckbox
                    isChecked={isDateBased}
                    priceId={price_id}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Date-based pricing
                  </span>
                </label>
                <p className="ml-6 mt-1 text-xs text-gray-500 dark:text-slate-500">
                  Enable if this price applies to specific date ranges
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Sales Channels <span className="text-red-500">*</span>
                </label>

                {selectedSalesChannels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSalesChannels.map((channel) => (
                      <Link
                        key={channel.id}
                        href={buildUrlWithoutItem(
                          "salesChannelIds",
                          channel.id,
                        )}
                      >
                        <Badge variant="neutral" className="group">
                          <span>{channel.name}</span>
                          <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-2">
                  <SalesChannelSelectButton priceId={price_id} />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                  Choose which sales channels this price applies to
                </p>
              </div>

              {isDateBased && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Date Ranges <span className="text-red-500">*</span>
                  </label>

                  {selectedDateRanges.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDateRanges.map((dateRange) => (
                        <Link
                          key={dateRange.id}
                          href={buildUrlWithoutItem(
                            "dateRangeIds",
                            dateRange.id,
                          )}
                        >
                          <Badge variant="neutral" className="group">
                            <span>{dateRange.name}</span>
                            <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-2">
                    <DateRangeSelectButton priceId={price_id} />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                    Choose specific date ranges for this price
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <PendingOverlay mode="navigation" href="/inventory/prices">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </PendingOverlay>
                <PendingOverlay mode="navigation" href={buildInitialUrl()}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </PendingOverlay>
                <PendingOverlay mode="form">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Update Price
                  </button>
                </PendingOverlay>
              </div>
            </form>

            <DeletePriceButton price={priceForDelete as any} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
