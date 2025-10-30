// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/create-new/page.tsx

import { createEsimOffer } from "@/app/(backend)/server_actions/esim-offers/createEsimOffer"
import { getAllCountriesOfOrg } from "@/app/(backend)/server_actions/countries/getAllCountriesOfOrg"
import { getSalesChannelsByIds } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelsByIds"
import { getPricesByIds } from "@/app/(backend)/server_actions/prices/getPricesByIds"
import { getMediaById } from "@/app/(backend)/server_actions/media/getMediaById"
import { getMediaByIds } from "@/app/(backend)/server_actions/media/getMediaByIds"
import { getAllOfferInclusions } from "@/app/(backend)/server_actions/offer-inclusions/getAllOfferInclusions"
import { getAllOfferExclusions } from "@/app/(backend)/server_actions/offer-exclusions/getAllOfferExclusions"
import Link from "next/link"
import { RiArrowLeftLine, RiCloseLine, RiAddLine } from "@remixicon/react"
import { Badge } from "@/components/common/Badge"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import CountrySelectButton from "./CountrySelectButton.client"
import SalesChannelSelectButton from "./SalesChannelSelectButton.client"
import PriceSelectButton from "./PriceSelectButton.client"
import MainImageSelectButton from "./MainImageSelectButton.client"
import ImagesSelectButton from "./ImagesSelectButton.client"
import InclusionsMultiSelect from "./InclusionsMultiSelect.client"
import ExclusionsMultiSelect from "./ExclusionsMultiSelect.client"
import UnlimitedDataCheckbox from "./UnlimitedDataCheckbox.client"
import IsActiveCheckbox from "./IsActiveCheckbox.client"
import DescriptionHtmlEditor from "./DescriptionHtmlEditor.client"
import MainImageDisplay from "./MainImageDisplay.client"
import ImageGalleryItem from "./ImageGalleryItem.client"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const title = params.title || ""
  const descriptionHtml = params.descriptionHtml || ""
  const descriptionText = params.descriptionText || ""
  const durationInDays = params.durationInDays || ""
  const dataInGb = params.dataInGb || ""
  const isUnlimitedData = params.isUnlimitedData === "true"
  const isActive = params.isActive !== "false"
  const inclusionIds = params.inclusionIds || ""
  const exclusionIds = params.exclusionIds || ""
  const mainImageId = params.mainImageId || ""
  const imageIds = params.imageIds || ""
  const countryIds = params.countryIds || ""
  const salesChannelIds = params.salesChannelIds || ""
  const priceIds = params.priceIds || ""

  const selectedInclusionIds = inclusionIds
    ? inclusionIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedExclusionIds = exclusionIds
    ? exclusionIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedCountryIds = countryIds
    ? countryIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedSalesChannelIds = salesChannelIds
    ? salesChannelIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedPriceIds = priceIds
    ? priceIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedImageIds = imageIds
    ? imageIds.split(",").map(Number).filter(Boolean)
    : []

  const [
    allInclusions,
    allExclusions,
    allCountries,
    selectedSalesChannels,
    selectedPrices,
    mainImage,
    selectedImages,
  ] = await Promise.all([
    getAllOfferInclusions(),
    getAllOfferExclusions(),
    getAllCountriesOfOrg(),
    getSalesChannelsByIds(selectedSalesChannelIds),
    getPricesByIds(selectedPriceIds),
    mainImageId ? getMediaById(Number(mainImageId)) : Promise.resolve(null),
    getMediaByIds(selectedImageIds),
  ])

  const selectedCountries = allCountries.filter((country) =>
    selectedCountryIds.includes(country.id),
  )

  const inclusionOptions = allInclusions.map((inclusion) => ({
    value: String(inclusion.id),
    label: inclusion.body,
  }))

  const exclusionOptions = allExclusions.map((exclusion) => ({
    value: String(exclusion.id),
    label: exclusion.body,
  }))

  const buildUrlWithoutItem = (
    field:
      | "countryIds"
      | "salesChannelIds"
      | "priceIds"
      | "imageIds"
      | "mainImageId",
    idToRemove: number,
  ) => {
    const urlParams = new URLSearchParams()

    if (field === "countryIds") {
      const remaining = selectedCountryIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        urlParams.set("countryIds", remaining.join(","))
      }
    } else if (field === "salesChannelIds") {
      const remaining = selectedSalesChannelIds.filter(
        (id) => id !== idToRemove,
      )
      if (remaining.length > 0) {
        urlParams.set("salesChannelIds", remaining.join(","))
      }
    } else if (field === "priceIds") {
      const remaining = selectedPriceIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        urlParams.set("priceIds", remaining.join(","))
      }
    } else if (field === "imageIds") {
      const remaining = selectedImageIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        urlParams.set("imageIds", remaining.join(","))
      }
    }

    if (title) urlParams.set("title", title)
    if (descriptionHtml) urlParams.set("descriptionHtml", descriptionHtml)
    if (descriptionText) urlParams.set("descriptionText", descriptionText)
    if (durationInDays) urlParams.set("durationInDays", durationInDays)
    if (dataInGb) urlParams.set("dataInGb", dataInGb)
    if (isUnlimitedData) urlParams.set("isUnlimitedData", "true")
    if (!isActive) urlParams.set("isActive", "false")
    if (inclusionIds) urlParams.set("inclusionIds", inclusionIds)
    if (exclusionIds) urlParams.set("exclusionIds", exclusionIds)

    if (field !== "mainImageId" && mainImageId)
      urlParams.set("mainImageId", mainImageId)
    if (field !== "imageIds" && imageIds) urlParams.set("imageIds", imageIds)
    if (field !== "countryIds" && countryIds)
      urlParams.set("countryIds", countryIds)
    if (field !== "salesChannelIds" && salesChannelIds)
      urlParams.set("salesChannelIds", salesChannelIds)
    if (field !== "priceIds" && priceIds) urlParams.set("priceIds", priceIds)

    return `/inventory/offers/create-new?${urlParams.toString()}`
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/inventory/offers"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Create New eSIM Offer
            </h1>
            <p className="text-sm text-gray-500">
              Add a new eSIM offer to your inventory
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="w-full max-w-3xl">
            <form action={createEsimOffer} className="flex flex-col gap-6">
              <input
                type="hidden"
                name="inclusionIds"
                value={JSON.stringify(selectedInclusionIds)}
              />
              <input
                type="hidden"
                name="exclusionIds"
                value={JSON.stringify(selectedExclusionIds)}
              />
              <input type="hidden" name="mainImageId" value={mainImageId} />
              <input
                type="hidden"
                name="imageIds"
                value={JSON.stringify(selectedImageIds)}
              />
              <input
                type="hidden"
                name="countryIds"
                value={JSON.stringify(selectedCountryIds)}
              />
              <input
                type="hidden"
                name="salesChannelIds"
                value={JSON.stringify(selectedSalesChannelIds)}
              />
              <input
                type="hidden"
                name="priceIds"
                value={JSON.stringify(selectedPriceIds)}
              />
              <input
                type="hidden"
                name="isUnlimitedData"
                value={isUnlimitedData ? "true" : "false"}
              />
              <input
                type="hidden"
                name="isActive"
                value={isActive ? "true" : "false"}
              />

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={title}
                  placeholder="e.g., Europe Travel Plan, USA Unlimited Data"
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>

              <div>
                <label
                  htmlFor="descriptionHtml"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Description (Formatted){" "}
                  <span className="text-red-500">*</span>
                </label>
                <DescriptionHtmlEditor initialValue={descriptionHtml} />
              </div>

              <div>
                <label
                  htmlFor="descriptionText"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Description (Plain Text){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descriptionText"
                  name="descriptionText"
                  required
                  rows={4}
                  defaultValue={descriptionText}
                  placeholder="Enter plain text description..."
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>

              <div>
                <label
                  htmlFor="durationInDays"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="durationInDays"
                  name="durationInDays"
                  required
                  min="1"
                  defaultValue={durationInDays}
                  placeholder="e.g., 7, 14, 30"
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <UnlimitedDataCheckbox isChecked={isUnlimitedData} />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Unlimited Data
                  </span>
                </label>
                <p className="ml-6 mt-1 text-xs text-gray-500 dark:text-slate-400">
                  Check this if the offer includes unlimited data
                </p>
              </div>

              {!isUnlimitedData && (
                <div>
                  <label
                    htmlFor="dataInGb"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Data (GB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="dataInGb"
                    name="dataInGb"
                    required
                    step="0.01"
                    min="0"
                    defaultValue={dataInGb}
                    placeholder="e.g., 5, 10, 50"
                    className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Inclusions
                </label>
                <div className="mt-2">
                  <InclusionsMultiSelect
                    options={inclusionOptions}
                    selectedValues={selectedInclusionIds.map(String)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Exclusions
                </label>
                <div className="mt-2">
                  <ExclusionsMultiSelect
                    options={exclusionOptions}
                    selectedValues={selectedExclusionIds.map(String)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Main Image
                </label>
                {mainImage && (
                  <div className="mt-2">
                    <MainImageDisplay
                      imageUrl={mainImage.url}
                      imageAlt={mainImage.description || "Main image"}
                      removeUrl={buildUrlWithoutItem(
                        "mainImageId",
                        Number(mainImageId),
                      )}
                    />
                  </div>
                )}
                <div className="mt-2">
                  <MainImageSelectButton />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Images
                </label>
                {selectedImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-4">
                    {selectedImages.map((image) => (
                      <ImageGalleryItem
                        key={image.id}
                        imageUrl={image.url}
                        imageAlt={image.description || "Image"}
                        removeUrl={buildUrlWithoutItem("imageIds", image.id)}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <ImagesSelectButton />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Countries <span className="text-red-500">*</span>
                </label>
                {selectedCountries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCountries.map((country) => (
                      <Link
                        key={country.id}
                        href={buildUrlWithoutItem("countryIds", country.id)}
                      >
                        <Badge variant="neutral" className="group">
                          <span>{country.name}</span>
                          <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <CountrySelectButton />
                </div>
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
                  <SalesChannelSelectButton />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Prices <span className="text-red-500">*</span>
                </label>
                {selectedPrices.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPrices.map((price) => (
                      <Link
                        key={price.id}
                        href={buildUrlWithoutItem("priceIds", price.id)}
                      >
                        <Badge variant="neutral" className="group">
                          <span>{price.name}</span>
                          <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <PriceSelectButton />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <IsActiveCheckbox isChecked={isActive} />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Active
                  </span>
                </label>
                <p className="ml-6 mt-1 text-xs text-gray-500 dark:text-slate-400">
                  Active offers are visible and available for purchase
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <PendingOverlay mode="navigation" href="/inventory/offers">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </PendingOverlay>

                <PendingOverlay mode="form">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                  >
                    <RiAddLine className="mr-2 h-4 w-4" />
                    <span>Create eSIM Offer</span>
                  </button>
                </PendingOverlay>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
