// apps/cms/app/(backend)/server_actions/esim-offers/getAllEsimOffersPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedEsimOffersResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  limit?: string | number
  search?: string
  minDataInGb?: string | number
  maxDataInGb?: string | number
  isUnlimitedData?: boolean
  isActive?: boolean
  minDurationInDays?: string | number
  maxDurationInDays?: string | number
  countryIds?: number[]
  salesChannelIds?: number[]
  priceIds?: number[]
}

export const getAllEsimOffersPaginated = async ({
  page = 1,
  limit = 10,
  search,
  minDataInGb,
  maxDataInGb,
  isUnlimitedData,
  isActive,
  minDurationInDays,
  maxDurationInDays,
  countryIds,
  salesChannelIds,
  priceIds,
}: PaginationParams): Promise<PaginatedEsimOffersResponse> => {
  try {
    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))
    params.append("limit", String(limit))

    if (search) {
      params.append("search", search)
    }

    if (minDataInGb !== undefined) {
      params.append("minDataInGb", String(minDataInGb))
    }

    if (maxDataInGb !== undefined) {
      params.append("maxDataInGb", String(maxDataInGb))
    }

    if (isUnlimitedData !== undefined) {
      params.append("isUnlimitedData", String(isUnlimitedData))
    }

    if (isActive !== undefined) {
      params.append("isActive", String(isActive))
    }

    if (minDurationInDays !== undefined) {
      params.append("minDurationInDays", String(minDurationInDays))
    }

    if (maxDurationInDays !== undefined) {
      params.append("maxDurationInDays", String(maxDurationInDays))
    }

    if (countryIds && countryIds.length > 0) {
      params.append("countryIds", countryIds.join(","))
    }

    if (salesChannelIds && salesChannelIds.length > 0) {
      params.append("salesChannelIds", salesChannelIds.join(","))
    }

    if (priceIds && priceIds.length > 0) {
      params.append("priceIds", priceIds.join(","))
    }

    const response = await api.get(
      `/esim-offers/paginated?${params.toString()}`,
    )

    if (response.status !== 200) {
      throw new Error("Failed to fetch eSIM offers")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch eSIM offers:", errorMessage)
    throw new Error(errorMessage)
  }
}
