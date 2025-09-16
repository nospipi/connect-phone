"use server"

import { AxiosError } from "axios"
import {
  ErrorResponse,
  PaginatedUsersResponse,
  PaginationParams,
} from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

export const getAllUsersOfOrganizationPaginated = async ({
  page = 1,
}: PaginationParams): Promise<PaginatedUsersResponse> => {
  try {
    console.log("Fetching users for organization:", "page:", page)

    const api = createApiClient()
    const response = await api.get(`/users/paginated?page=${page}`)

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
