// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/prices/PricesFilters.client.tsx
"use client"

import { useState } from "react"
import { RiSearchLine } from "@remixicon/react"
import {
  CURRENCIES,
  IDateRange,
  ISalesChannel,
} from "@connect-phone/shared-types"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import MultiSelect from "@/components/common/MultiSelect.client"
import DateRangeSelector from "./DateRangeSelector.client"
import SalesChannelSelector from "./SalesChannelSelector.client"

//------------------------------------------------------------

interface PricesFiltersProps {
  currentFilters: {
    search: string
    minAmount: string
    maxAmount: string
    currencies: string[]
    dateRanges: IDateRange[]
    salesChannels: ISalesChannel[]
  }
}

export default function PricesFilters({ currentFilters }: PricesFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search)
  const [minAmount, setMinAmount] = useState(currentFilters.minAmount)
  const [maxAmount, setMaxAmount] = useState(currentFilters.maxAmount)
  const [currencies, setCurrencies] = useState<string[]>(
    currentFilters.currencies,
  )
  const [dateRanges, setDateRanges] = useState<IDateRange[]>(
    currentFilters.dateRanges,
  )
  const [salesChannels, setSalesChannels] = useState<ISalesChannel[]>(
    currentFilters.salesChannels,
  )

  const currencyOptions = CURRENCIES.map((curr) => ({
    value: curr.code,
    label: `${curr.code} - ${curr.name}`,
  }))

  const hasActiveFilters =
    search !== "" ||
    minAmount !== "" ||
    maxAmount !== "" ||
    currencies.length > 0 ||
    dateRanges.length > 0 ||
    salesChannels.length > 0

  const buildApplyUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("page", "1")

    if (search) urlParams.set("search", search)
    if (minAmount) urlParams.set("minAmount", minAmount)
    if (maxAmount) urlParams.set("maxAmount", maxAmount)
    if (currencies.length > 0) urlParams.set("currencies", currencies.join(","))
    if (dateRanges.length > 0) {
      urlParams.set("dateRangeIds", dateRanges.map((dr) => dr.id).join(","))
    }
    if (salesChannels.length > 0) {
      urlParams.set(
        "salesChannelIds",
        salesChannels.map((sc) => sc.id).join(","),
      )
    }

    return `/inventory/prices?${urlParams.toString()}`
  }

  const handleRemoveDateRange = (id: number) => {
    setDateRanges(dateRanges.filter((dr) => dr.id !== id))
  }

  const handleRemoveSalesChannel = (id: number) => {
    setSalesChannels(salesChannels.filter((sc) => sc.id !== id))
  }

  const baseFilters = {
    search,
    minAmount,
    maxAmount,
    currencies,
  }

  return (
    <div className="my-2 flex gap-2 px-5 pr-2">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[200px] flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prices..."
              className="block w-full border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
            />
          </div>

          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="Min amount"
            step="0.01"
            min="0"
            className="block w-32 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
          />

          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="Max amount"
            step="0.01"
            min="0"
            className="block w-32 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="min-w-[200px] flex-1">
            <MultiSelect
              fieldName="currencies"
              options={currencyOptions}
              selectedValues={currencies}
              placeholder="Select currencies..."
              onChange={setCurrencies}
            />
          </div>

          <DateRangeSelector
            selectedDateRanges={dateRanges}
            currentFilters={baseFilters}
            onRemove={handleRemoveDateRange}
          />

          <SalesChannelSelector
            selectedSalesChannels={salesChannels}
            currentFilters={baseFilters}
            onRemove={handleRemoveSalesChannel}
          />
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-2">
        <PendingOverlay mode="navigation" href={buildApplyUrl()}>
          <button
            type="button"
            className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
          >
            Apply
          </button>
        </PendingOverlay>
        {hasActiveFilters && (
          <PendingOverlay mode="navigation" href="/inventory/prices">
            <button
              type="button"
              className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
            >
              Clear
            </button>
          </PendingOverlay>
        )}
      </div>
    </div>
  )
}
