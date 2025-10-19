// apps/cms/app/(backend)/server_actions/prices/getAllPricesPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedPricesResponse } from "../types"
import { createApiClient } from "../api-client"
import { Currency } from "@connect-phone/shared-types"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  limit?: string | number
  search?: string
  minAmount?: string | number
  maxAmount?: string | number
  currencies?: Currency[]
  dateRangeIds?: number[]
  salesChannelIds?: number[]
}

export const getAllPricesPaginated = async ({
  page = 1,
  limit = 10,
  search,
  minAmount,
  maxAmount,
  currencies,
  dateRangeIds,
  salesChannelIds,
}: PaginationParams): Promise<PaginatedPricesResponse> => {
  try {
    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))
    params.append("limit", String(limit))

    if (search) {
      params.append("search", search)
    }

    if (minAmount !== undefined) {
      params.append("minAmount", String(minAmount))
    }

    if (maxAmount !== undefined) {
      params.append("maxAmount", String(maxAmount))
    }

    if (currencies && currencies.length > 0) {
      params.append("currencies", currencies.join(","))
    }

    if (dateRangeIds && dateRangeIds.length > 0) {
      params.append("dateRangeIds", dateRangeIds.join(","))
    }

    if (salesChannelIds && salesChannelIds.length > 0) {
      params.append("salesChannelIds", salesChannelIds.join(","))
    }

    const response = await api.get(`/prices/paginated?${params.toString()}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch prices")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch prices:", errorMessage)
    throw new Error(errorMessage)
  }
}
