// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/offers/OffersFilters.client.tsx
"use client"

import { useState, useEffect } from "react"
import { RiSearchLine, RiFilter3Line, RiCloseLine } from "@remixicon/react"
import { ICountry, ISalesChannel, IPrice } from "@connect-phone/shared-types"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import CountrySelector from "./CountrySelector.client"
import SalesChannelSelector from "./SalesChannelSelector.client"
import PriceSelector from "./PriceSelector.client"

//------------------------------------------------------------

interface OffersFiltersProps {
  currentFilters: {
    search: string
    minDataInGb: string
    maxDataInGb: string
    isUnlimitedData: string
    minDurationInDays: string
    maxDurationInDays: string
    isActive: string
    countries: ICountry[]
    salesChannels: ISalesChannel[]
    prices: IPrice[]
  }
}

export default function OffersFilters({ currentFilters }: OffersFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search)
  const [minDataInGb, setMinDataInGb] = useState(currentFilters.minDataInGb)
  const [maxDataInGb, setMaxDataInGb] = useState(currentFilters.maxDataInGb)
  const [isUnlimitedData, setIsUnlimitedData] = useState(
    currentFilters.isUnlimitedData,
  )
  const [minDurationInDays, setMinDurationInDays] = useState(
    currentFilters.minDurationInDays,
  )
  const [maxDurationInDays, setMaxDurationInDays] = useState(
    currentFilters.maxDurationInDays,
  )
  const [isActive, setIsActive] = useState(currentFilters.isActive)
  const [countries, setCountries] = useState<ICountry[]>(
    currentFilters.countries,
  )
  const [salesChannels, setSalesChannels] = useState<ISalesChannel[]>(
    currentFilters.salesChannels,
  )
  const [prices, setPrices] = useState<IPrice[]>(currentFilters.prices)

  useEffect(() => {
    setSearch(currentFilters.search)
    setMinDataInGb(currentFilters.minDataInGb)
    setMaxDataInGb(currentFilters.maxDataInGb)
    setIsUnlimitedData(currentFilters.isUnlimitedData)
    setMinDurationInDays(currentFilters.minDurationInDays)
    setMaxDurationInDays(currentFilters.maxDurationInDays)
    setIsActive(currentFilters.isActive)
    setCountries(currentFilters.countries)
    setSalesChannels(currentFilters.salesChannels)
    setPrices(currentFilters.prices)
  }, [currentFilters])

  const hasActiveFilters =
    search !== "" ||
    minDataInGb !== "" ||
    maxDataInGb !== "" ||
    isUnlimitedData !== "" ||
    minDurationInDays !== "" ||
    maxDurationInDays !== "" ||
    isActive !== "" ||
    countries.length > 0 ||
    salesChannels.length > 0 ||
    prices.length > 0

  const hasAdvancedFilters =
    minDataInGb !== "" ||
    maxDataInGb !== "" ||
    isUnlimitedData !== "" ||
    minDurationInDays !== "" ||
    maxDurationInDays !== "" ||
    isActive !== "" ||
    countries.length > 0 ||
    salesChannels.length > 0 ||
    prices.length > 0

  const buildApplyUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("page", "1")

    if (search) urlParams.set("search", search)
    if (minDataInGb) urlParams.set("minDataInGb", minDataInGb)
    if (maxDataInGb) urlParams.set("maxDataInGb", maxDataInGb)
    if (isUnlimitedData) urlParams.set("isUnlimitedData", isUnlimitedData)
    if (minDurationInDays) urlParams.set("minDurationInDays", minDurationInDays)
    if (maxDurationInDays) urlParams.set("maxDurationInDays", maxDurationInDays)
    if (isActive) urlParams.set("isActive", isActive)
    if (countries.length > 0) {
      urlParams.set("countryIds", countries.map((c) => c.id).join(","))
    }
    if (salesChannels.length > 0) {
      urlParams.set(
        "salesChannelIds",
        salesChannels.map((sc) => sc.id).join(","),
      )
    }
    if (prices.length > 0) {
      urlParams.set("priceIds", prices.map((p) => p.id).join(","))
    }

    return `/inventory/offers?${urlParams.toString()}`
  }

  const handleRemoveCountry = (id: number) => {
    setCountries(countries.filter((c) => c.id !== id))
  }

  const handleRemoveSalesChannel = (id: number) => {
    setSalesChannels(salesChannels.filter((sc) => sc.id !== id))
  }

  const handleRemovePrice = (id: number) => {
    setPrices(prices.filter((p) => p.id !== id))
  }

  const baseFilters = {
    search,
    minDataInGb,
    maxDataInGb,
    isUnlimitedData,
    minDurationInDays,
    maxDurationInDays,
    isActive,
    countryIds: countries.map((c) => c.id).join(","),
    salesChannelIds: salesChannels.map((sc) => sc.id).join(","),
    priceIds: prices.map((p) => p.id).join(","),
  }

  return (
    <>
      <input type="checkbox" id="more-filters-drawer" className="peer hidden" />

      <div className="my-2 flex flex-wrap items-center gap-2 px-5">
        <div className="relative min-w-[200px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers..."
            className="block w-full border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>

        <label
          htmlFor="more-filters-drawer"
          className="relative flex cursor-pointer select-none items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
        >
          <RiFilter3Line className="h-4 w-4" />
          <span>Advanced filters</span>
          {hasAdvancedFilters && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white dark:bg-indigo-500">
              !
            </span>
          )}
        </label>

        <PendingOverlay mode="navigation" href={buildApplyUrl()}>
          <button
            type="button"
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

      <label
        htmlFor="more-filters-drawer"
        className="invisible absolute inset-0 z-40 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 peer-checked:visible peer-checked:opacity-100"
      />

      <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex translate-y-full transform flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out peer-checked:translate-y-0 dark:bg-gray-950">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Advanced Filters
          </h3>
          <label
            htmlFor="more-filters-drawer"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <RiCloseLine className="h-5 w-5" />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Status
              </h4>
              <div className="space-y-3">
                <select
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200"
                >
                  <option value="">All Offers</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Data Options
              </h4>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-2 pl-1">
                  <input
                    type="checkbox"
                    checked={isUnlimitedData === "true"}
                    onChange={(e) =>
                      setIsUnlimitedData(e.target.checked ? "true" : "")
                    }
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Unlimited Data Only
                  </span>
                </label>

                {isUnlimitedData !== "true" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Min Data (GB)
                      </label>
                      <input
                        type="number"
                        value={minDataInGb}
                        onChange={(e) => setMinDataInGb(e.target.value)}
                        placeholder="0"
                        step="0.1"
                        min="0"
                        className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Max Data (GB)
                      </label>
                      <input
                        type="number"
                        value={maxDataInGb}
                        onChange={(e) => setMaxDataInGb(e.target.value)}
                        placeholder="0"
                        step="0.1"
                        min="0"
                        className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Duration Range (Days)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Minimum Days
                  </label>
                  <input
                    type="number"
                    value={minDurationInDays}
                    onChange={(e) => setMinDurationInDays(e.target.value)}
                    placeholder="1"
                    min="1"
                    step="1"
                    className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Maximum Days
                  </label>
                  <input
                    type="number"
                    value={maxDurationInDays}
                    onChange={(e) => setMaxDurationInDays(e.target.value)}
                    placeholder="30"
                    min="1"
                    step="1"
                    className="block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Countries
              </h4>
              <CountrySelector
                selectedCountries={countries}
                currentFilters={baseFilters}
                onRemove={handleRemoveCountry}
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

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Prices
              </h4>
              <PriceSelector
                selectedPrices={prices}
                currentFilters={baseFilters}
                onRemove={handleRemovePrice}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-800">
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
    </>
  )
}
