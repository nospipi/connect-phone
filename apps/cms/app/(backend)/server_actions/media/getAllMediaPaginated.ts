// apps/cms/app/(backend)/server_actions/media/getAllMediaPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedMediaResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  search?: string
}

export const getAllMediaPaginated = async ({
  page = 1,
  search,
}: PaginationParams): Promise<PaginatedMediaResponse> => {
  try {
    console.log("Fetching media:", "page:", page, "search:", search)

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))

    if (search) {
      params.append("search", search)
    }

    const response = await api.get(`/media/paginated?${params.toString()}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch media")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch media:", errorMessage)
    throw new Error(errorMessage)
  }
}
