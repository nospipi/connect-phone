// server_actions/getAllUsersOfOrganizationPaginated.ts

"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedUsersResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
  search?: string
  role?: string
}

export const getAllUsersOfOrganizationPaginated = async ({
  page = 1,
  search,
  role,
}: PaginationParams): Promise<PaginatedUsersResponse> => {
  try {
    const api = createApiClient()
    const response = await api.get(
      `/users/paginated?page=${page}&search=${search}&role=${role}`,
    )

    if (response.status !== 200) {
      throw new Error("Failed to fetch users")
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
