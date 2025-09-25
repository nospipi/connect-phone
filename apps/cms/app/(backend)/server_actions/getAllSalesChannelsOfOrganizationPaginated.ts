// server_actions/getAllSalesChannelsOfOrganizationPaginated.ts

"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedSalesChannelsResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
}

export const getAllSalesChannelsOfOrganizationPaginated = async ({
  page = 1,
}: PaginationParams): Promise<PaginatedSalesChannelsResponse> => {
  try {
    console.log("Fetching sales channels for organization ID:", "page:", page)

    const api = createApiClient()
    const response = await api.get(`/sales-channels/paginated?page=${page}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch sales channels")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    throw new Error(errorMessage)
  }
}
