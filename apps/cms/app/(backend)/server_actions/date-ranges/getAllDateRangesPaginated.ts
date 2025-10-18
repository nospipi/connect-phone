// apps/cms/app/(backend)/server_actions/date-ranges/getAllDateRangesPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedDateRangesResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  date?: string
  search?: string
}

export const getAllDateRangesPaginated = async ({
  page = 1,
  date,
  search,
}: PaginationParams): Promise<PaginatedDateRangesResponse> => {
  try {


    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))

    if (date) {
      params.append("date", date)
    }

    if (search) {
      params.append("search", search)
    }

    const response = await api.get(
      `/date-ranges/paginated?${params.toString()}`,
    )

    if (response.status !== 200) {
      throw new Error("Failed to fetch date ranges")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch date ranges:", errorMessage)
    throw new Error(errorMessage)
  }
}
