// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/[offer_id]/page.tsx

import { updateEsimOffer } from "@/app/(backend)/server_actions/esim-offers/updateEsimOffer"
import { getCountriesByIds } from "@/app/(backend)/server_actions/countries/getCountriesByIds"
import { getSalesChannelsByIds } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelsByIds"
import { getPricesByIds } from "@/app/(backend)/server_actions/prices/getPricesByIds"
import { getMediaById } from "@/app/(backend)/server_actions/media/getMediaById"
import { getAllOfferInclusions } from "@/app/(backend)/server_actions/offer-inclusions/getAllOfferInclusions"
import { getAllOfferExclusions } from "@/app/(backend)/server_actions/offer-exclusions/getAllOfferExclusions"
import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import CountrySelectButton from "./CountrySelectButton.client"
import SalesChannelSelectButton from "./SalesChannelSelectButton.client"
import PriceSelectButton from "./PriceSelectButton.client"
import MainImageSelectButton from "./MainImageSelectButton.client"
import ImagesSelectButton from "./ImagesSelectButton.client"
import InclusionsMultiSelect from "./InclusionsMultiSelect.client"
import ExclusionsMultiSelect from "./ExclusionsMultiSelect.client"
import UnlimitedDataCheckbox from "./UnlimitedDataCheckbox.client"
import SelectedItemBadge from "./SelectedItemBadge.client"
import DescriptionHtmlEditor from "./DescriptionHtmlEditor.client"

//------------------------------------------------------------

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ offer_id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { offer_id } = await params
  const urlParams = await searchParams

  const title = urlParams.title || ""
  const descriptionHtml = urlParams.descriptionHtml || ""
  const descriptionText = urlParams.descriptionText || ""
  const durationInDays = urlParams.durationInDays || ""
  const dataInGb = urlParams.dataInGb || ""
  const isUnlimitedData = urlParams.isUnlimitedData === "true"
  const inclusionIds = urlParams.inclusionIds || ""
  const exclusionIds = urlParams.exclusionIds || ""
  const mainImageId = urlParams.mainImageId || ""
  const imageIds = urlParams.imageIds || ""
  const countryIds = urlParams.countryIds || ""
  const salesChannelIds = urlParams.salesChannelIds || ""
  const priceIds = urlParams.priceIds || ""

  const allInclusions = await getAllOfferInclusions()
  const allExclusions = await getAllOfferExclusions()

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

  const selectedCountries = await getCountriesByIds(selectedCountryIds)

  const selectedSalesChannels = await getSalesChannelsByIds(
    selectedSalesChannelIds,
  )

  const selectedPrices = await getPricesByIds(selectedPriceIds)

  const mainImage = mainImageId ? await getMediaById(Number(mainImageId)) : null

  const selectedImages = await Promise.all(
    selectedImageIds.map((id) => getMediaById(id)),
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
    const newParams = new URLSearchParams()

    if (field === "countryIds") {
      const remaining = selectedCountryIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        newParams.set("countryIds", remaining.join(","))
      }
      if (salesChannelIds) newParams.set("salesChannelIds", salesChannelIds)
      if (priceIds) newParams.set("priceIds", priceIds)
      if (imageIds) newParams.set("imageIds", imageIds)
    } else if (field === "salesChannelIds") {
      const remaining = selectedSalesChannelIds.filter(
        (id) => id !== idToRemove,
      )
      if (remaining.length > 0) {
        newParams.set("salesChannelIds", remaining.join(","))
      }
      if (countryIds) newParams.set("countryIds", countryIds)
      if (priceIds) newParams.set("priceIds", priceIds)
      if (imageIds) newParams.set("imageIds", imageIds)
    } else if (field === "priceIds") {
      const remaining = selectedPriceIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        newParams.set("priceIds", remaining.join(","))
      }
      if (countryIds) newParams.set("countryIds", countryIds)
      if (salesChannelIds) newParams.set("salesChannelIds", salesChannelIds)
      if (imageIds) newParams.set("imageIds", imageIds)
    } else if (field === "imageIds") {
      const remaining = selectedImageIds.filter((id) => id !== idToRemove)
      if (remaining.length > 0) {
        newParams.set("imageIds", remaining.join(","))
      }
      if (countryIds) newParams.set("countryIds", countryIds)
      if (salesChannelIds) newParams.set("salesChannelIds", salesChannelIds)
      if (priceIds) newParams.set("priceIds", priceIds)
    }

    if (title) newParams.set("title", title)
    if (descriptionHtml) newParams.set("descriptionHtml", descriptionHtml)
    if (descriptionText) newParams.set("descriptionText", descriptionText)
    if (durationInDays) newParams.set("durationInDays", durationInDays)
    if (dataInGb) newParams.set("dataInGb", dataInGb)
    if (isUnlimitedData) newParams.set("isUnlimitedData", "true")
    if (inclusionIds) newParams.set("inclusionIds", inclusionIds)
    if (exclusionIds) newParams.set("exclusionIds", exclusionIds)

    if (field !== "mainImageId" && mainImageId)
      newParams.set("mainImageId", mainImageId)

    return `/inventory/offers/${offer_id}?${newParams.toString()}`
  }

  const formKey = `${title}-${durationInDays}-${dataInGb}-${isUnlimitedData}-${selectedCountryIds.join(",")}-${selectedSalesChannelIds.join(",")}-${selectedPriceIds.join(",")}-${selectedInclusionIds.join(",")}-${selectedExclusionIds.join(",")}`

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
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
              Edit eSIM Offer
            </h1>
            <p className="text-sm text-gray-500">
              Update the eSIM offer information
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="flex w-full max-w-3xl flex-col gap-10">
            <form
              key={formKey}
              action={updateEsimOffer}
              className="flex flex-1 flex-col gap-6"
            >
              <input type="hidden" name="id" value={offer_id} />
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
                <DescriptionHtmlEditor
                  initialValue={descriptionHtml}
                  offerId={offer_id}
                />
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
                  <UnlimitedDataCheckbox
                    isChecked={isUnlimitedData}
                    offerId={offer_id}
                  />
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
                    offerId={offer_id}
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
                    offerId={offer_id}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Main Image
                </label>
                {mainImage && (
                  <div className="mt-2">
                    <SelectedItemBadge
                      id={mainImage.id}
                      label={`#${mainImage.id} ${mainImage.description || "No description"}`}
                      removeUrl={buildUrlWithoutItem(
                        "mainImageId",
                        Number(mainImageId),
                      )}
                    />
                  </div>
                )}
                <div className="mt-2">
                  <MainImageSelectButton offerId={offer_id} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Images
                </label>
                {selectedImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedImages.map((image) => (
                      <SelectedItemBadge
                        key={image.id}
                        id={image.id}
                        label={`#${image.id} ${image.description || "No description"}`}
                        removeUrl={buildUrlWithoutItem("imageIds", image.id)}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <ImagesSelectButton offerId={offer_id} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Countries <span className="text-red-500">*</span>
                </label>
                {selectedCountries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCountries.map((country) => (
                      <SelectedItemBadge
                        key={country.id}
                        id={country.id}
                        label={country.name}
                        removeUrl={buildUrlWithoutItem(
                          "countryIds",
                          country.id,
                        )}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <CountrySelectButton offerId={offer_id} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Sales Channels <span className="text-red-500">*</span>
                </label>
                {selectedSalesChannels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSalesChannels.map((channel) => (
                      <SelectedItemBadge
                        key={channel.id}
                        id={channel.id}
                        label={channel.name}
                        removeUrl={buildUrlWithoutItem(
                          "salesChannelIds",
                          channel.id,
                        )}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <SalesChannelSelectButton offerId={offer_id} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Prices <span className="text-red-500">*</span>
                </label>
                {selectedPrices.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPrices.map((price) => (
                      <SelectedItemBadge
                        key={price.id}
                        id={price.id}
                        label={price.name}
                        removeUrl={buildUrlWithoutItem("priceIds", price.id)}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <PriceSelectButton offerId={offer_id} />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <PendingOverlay mode="navigation" href="/inventory/offers">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </PendingOverlay>
                <PendingOverlay mode="form">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Update eSIM Offer
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
