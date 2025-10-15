// apps/cms/app/(backend)/server_actions/prices/getAllPricesPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedPricesResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  search?: string
}

export const getAllPricesPaginated = async ({
  page = 1,
  search,
}: PaginationParams): Promise<PaginatedPricesResponse> => {
  try {
    console.log("Fetching prices:", "page:", page, "search:", search)

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))

    if (search) {
      params.append("search", search)
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
