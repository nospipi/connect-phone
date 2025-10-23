// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/offers/OfferListItem.tsx

import { IEsimOffer } from "@connect-phone/shared-types"
import Image from "next/image"
import Link from "next/link"
import { RiImageLine } from "@remixicon/react"

//------------------------------------------------------------

interface OfferListItemProps {
  offer: IEsimOffer
}

export default function OfferListItem({ offer }: OfferListItemProps) {
  const displayCountries = offer.countries?.slice(0, 2) || []
  const remainingCountries = offer.countries?.slice(2) || []
  const displaySalesChannels = offer.salesChannels?.slice(0, 2) || []
  const remainingSalesChannels = offer.salesChannels?.slice(2) || []
  const displayPrices = offer.prices?.slice(0, 2) || []
  const remainingPrices = offer.prices?.slice(2) || []

  const remainingCountriesTitle = remainingCountries
    .map((c) => c.name)
    .join(", ")
  const remainingSalesChannelsTitle = remainingSalesChannels
    .map((c) => c.name)
    .join(", ")
  const remainingPricesTitle = remainingPrices.map((p) => p.name).join(", ")

  const buildEditUrl = () => {
    const urlParams = new URLSearchParams()

    if (offer.title) {
      urlParams.set("title", offer.title)
    }

    if (offer.descriptionHtml) {
      urlParams.set("descriptionHtml", offer.descriptionHtml)
    }

    if (offer.descriptionText) {
      urlParams.set("descriptionText", offer.descriptionText)
    }

    if (offer.durationInDays) {
      urlParams.set("durationInDays", offer.durationInDays.toString())
    }

    if (offer.dataInGb !== null && offer.dataInGb !== undefined) {
      urlParams.set("dataInGb", offer.dataInGb.toString())
    }

    if (offer.isUnlimitedData) {
      urlParams.set("isUnlimitedData", "true")
    }

    if (offer.inclusions && offer.inclusions.length > 0) {
      urlParams.set("inclusionIds", offer.inclusions.map((i) => i.id).join(","))
    }

    if (offer.exclusions && offer.exclusions.length > 0) {
      urlParams.set("exclusionIds", offer.exclusions.map((e) => e.id).join(","))
    }

    if (offer.mainImageId) {
      urlParams.set("mainImageId", offer.mainImageId.toString())
    }

    if (offer.images && offer.images.length > 0) {
      urlParams.set("imageIds", offer.images.map((img) => img.id).join(","))
    }

    if (offer.countries && offer.countries.length > 0) {
      urlParams.set("countryIds", offer.countries.map((c) => c.id).join(","))
    }

    if (offer.salesChannels && offer.salesChannels.length > 0) {
      urlParams.set(
        "salesChannelIds",
        offer.salesChannels.map((sc) => sc.id).join(","),
      )
    }

    if (offer.prices && offer.prices.length > 0) {
      urlParams.set("priceIds", offer.prices.map((p) => p.id).join(","))
    }

    const queryString = urlParams.toString()
    return `/inventory/offers/${offer.id}${queryString ? `?${queryString}` : ""}`
  }

  return (
    <Link href={buildEditUrl()} className="group block">
      <div className="py-5">
        <div className="flex gap-5">
          <div className="relative w-40 flex-shrink-0 self-stretch overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50">
            {offer.mainImage ? (
              <Image
                src={offer.mainImage.url}
                alt={offer.mainImage.description || offer.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <RiImageLine className="h-10 w-10 text-gray-300 dark:text-slate-600" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3">
              <div className="flex min-w-0 items-baseline gap-2.5">
                <span className="flex-shrink-0 text-xs font-medium text-gray-400 dark:text-slate-600">
                  #{offer.id}
                </span>
                <h3 className="min-w-0 flex-1 truncate text-lg font-semibold text-gray-900 group-hover:underline dark:text-slate-100">
                  {offer.title}
                </h3>
              </div>

              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-md font-bold text-indigo-600 dark:text-indigo-400">
                    {offer.isUnlimitedData ? "Unlimited Data" : offer.dataInGb}
                  </span>
                  {!offer.isUnlimitedData && (
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-500">
                      GB
                    </span>
                  )}
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
                <div className="flex items-baseline gap-1">
                  <span className="text-md font-bold text-gray-700 dark:text-slate-300">
                    {offer.durationInDays}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-500">
                    {offer.durationInDays === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {offer.countries && offer.countries.length > 0 && (
                <div className="flex items-start gap-3" title="Countries">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {displayCountries.map((country) => (
                      <div
                        key={country.id}
                        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1 dark:border-slate-700/50 dark:bg-slate-900/30"
                      >
                        {country.flagAvatarUrl && (
                          <Image
                            src={country.flagAvatarUrl}
                            alt={country.name}
                            width={20}
                            height={15}
                            className="h-4 w-5 rounded object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                          {country.name}
                        </span>
                      </div>
                    ))}
                    {remainingCountries.length > 0 && (
                      <span
                        title={remainingCountriesTitle}
                        className="cursor-help rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-500 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-400"
                      >
                        +{remainingCountries.length}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {offer.salesChannels && offer.salesChannels.length > 0 && (
                <div className="flex items-start gap-3" title="Sales Channels">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {displaySalesChannels.map((channel) => (
                      <span
                        key={channel.id}
                        className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-700 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-300"
                      >
                        {channel.name}
                      </span>
                    ))}
                    {remainingSalesChannels.length > 0 && (
                      <span
                        title={remainingSalesChannelsTitle}
                        className="cursor-help rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-500 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-400"
                      >
                        +{remainingSalesChannels.length}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {offer.prices && offer.prices.length > 0 && (
                <div className="flex items-start gap-3" title="Prices">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {displayPrices.map((price) => (
                      <span
                        key={price.id}
                        className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-700 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-300"
                      >
                        {price.name}
                      </span>
                    ))}
                    {remainingPrices.length > 0 && (
                      <span
                        title={remainingPricesTitle}
                        className="cursor-help rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-500 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-400"
                      >
                        +{remainingPrices.length}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
