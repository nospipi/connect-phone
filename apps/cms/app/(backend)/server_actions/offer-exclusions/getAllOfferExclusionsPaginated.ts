// apps/cms/app/(backend)/server_actions/offer-exclusions/getAllOfferExclusionsPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedOfferExclusionsResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  limit?: string | number
  search?: string
}

export const getAllOfferExclusionsPaginated = async ({
  page = 1,
  limit = 10,
  search,
}: PaginationParams): Promise<PaginatedOfferExclusionsResponse> => {
  try {
    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))
    params.append("limit", String(limit))

    if (search) {
      params.append("search", search)
    }

    const response = await api.get(
      `/offer-exclusions/paginated?${params.toString()}`,
    )

    if (response.status !== 200) {
      throw new Error("Failed to fetch offer exclusions")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch offer exclusions:", errorMessage)
    throw new Error(errorMessage)
  }
}
