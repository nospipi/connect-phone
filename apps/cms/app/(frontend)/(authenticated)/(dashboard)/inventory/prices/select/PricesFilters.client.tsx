// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/select/PricesFilters.client.tsx

"use client"

import { useState, useEffect } from "react"
import { RiSearchLine, RiFilter3Line, RiCloseLine } from "@remixicon/react"
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

  useEffect(() => {
    setSearch(currentFilters.search)
    setMinAmount(currentFilters.minAmount)
    setMaxAmount(currentFilters.maxAmount)
    setCurrencies(currentFilters.currencies)
    setDateRanges(currentFilters.dateRanges)
    setSalesChannels(currentFilters.salesChannels)
  }, [currentFilters])

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

  const hasAdvancedFilters =
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
    dateRangeIds: dateRanges.map((dr) => dr.id).join(","),
    salesChannelIds: salesChannels.map((sc) => sc.id).join(","),
  }

  return (
    <>
      <input type="checkbox" id="more-filters-drawer" className="peer hidden" />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prices..."
            className="block w-full border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>

        <label
          htmlFor="more-filters-drawer"
          className="relative flex flex-shrink-0 cursor-pointer select-none items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
        >
          <RiFilter3Line className="h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">More filters</span>
          {hasAdvancedFilters && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white dark:bg-indigo-500">
              !
            </span>
          )}
        </label>

        <PendingOverlay mode="navigation" href={buildApplyUrl()}>
          <button
            type="button"
            className="flex flex-shrink-0 items-center justify-center whitespace-nowrap border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
          >
            Apply
          </button>
        </PendingOverlay>

        {hasActiveFilters && (
          <PendingOverlay mode="navigation" href="/inventory/prices">
            <button
              type="button"
              className="flex flex-shrink-0 items-center justify-center whitespace-nowrap border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
            >
              Clear
            </button>
          </PendingOverlay>
        )}
      </div>

      <label
        htmlFor="more-filters-drawer"
        className="invisible fixed inset-0 z-40 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 peer-checked:visible peer-checked:opacity-100"
      />

      <div className="absolute bottom-0 left-0 right-0 z-50 max-h-[85vh] translate-y-full transform overflow-hidden border-t border-gray-200 bg-white p-4 shadow-2xl transition-transform duration-300 ease-out peer-checked:translate-y-0 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-full max-h-[85vh] flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-auto">
            <div className="flex items-center justify-end">
              <label
                htmlFor="more-filters-drawer"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <RiCloseLine className="h-5 w-5" />
              </label>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Amount Range
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Minimum Amount
                    </label>
                    <input
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Maximum Amount
                    </label>
                    <input
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Currencies
                </h4>
                <MultiSelect
                  fieldName="currencies"
                  options={currencyOptions}
                  selectedValues={currencies}
                  placeholder="Select currencies..."
                  onChange={setCurrencies}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Date Ranges
                </h4>
                <DateRangeSelector
                  selectedDateRanges={dateRanges}
                  currentFilters={baseFilters}
                  onRemove={handleRemoveDateRange}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Sales Channels
                </h4>
                <SalesChannelSelector
                  selectedSalesChannels={salesChannels}
                  currentFilters={baseFilters}
                  onRemove={handleRemoveSalesChannel}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <label
                htmlFor="more-filters-drawer"
                className="cursor-pointer border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </label>
              <PendingOverlay mode="navigation" href={buildApplyUrl()}>
                <button
                  type="button"
                  className="border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
              </PendingOverlay>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
