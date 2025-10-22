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
}

export const getAllEsimOffersPaginated = async ({
  page = 1,
  limit = 10,
  search,
}: PaginationParams): Promise<PaginatedEsimOffersResponse> => {
  try {
    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))
    params.append("limit", String(limit))

    if (search) {
      params.append("search", search)
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
