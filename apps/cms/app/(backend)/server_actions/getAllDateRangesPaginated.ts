// apps/cms/app/(backend)/server_actions/getAllDateRangesPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedDateRangesResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  date?: string
}

export const getAllDateRangesPaginated = async ({
  page = 1,
  date,
}: PaginationParams): Promise<PaginatedDateRangesResponse> => {
  try {
    console.log("Fetching date ranges:", "page:", page, "date:", date)

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))

    if (date) {
      params.append("date", date)
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
