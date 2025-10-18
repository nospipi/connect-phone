// apps/cms/app/(backend)/server_actions/sales-channels/getAllSalesChannelsOfOrganizationPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedSalesChannelsResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  search?: string
}

export const getAllSalesChannelsOfOrganizationPaginated = async ({
  page = 1,
  search = "",
}: PaginationParams): Promise<PaginatedSalesChannelsResponse> => {
  try {
    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("page", String(page))
    if (search) {
      params.append("search", search)
    }

    const response = await api.get(
      `/sales-channels/paginated?${params.toString()}`,
    )

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
