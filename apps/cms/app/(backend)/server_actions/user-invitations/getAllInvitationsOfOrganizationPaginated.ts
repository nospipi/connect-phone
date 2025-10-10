// server_actions/getAllInvitationsOfOrganizationPaginated.ts
"use server"

import { cache } from "react"
import { AxiosError } from "axios"
import { ErrorResponse, PaginatedInvitationsResponse } from "../types"
import { createApiClient } from "../api-client"

interface PaginationParams {
  page?: string | number
  search?: string
  role?: string
}

export const getAllInvitationsOfOrganizationPaginated = cache(
  async ({
    page = 1,
    search,
    role,
  }: PaginationParams): Promise<PaginatedInvitationsResponse> => {
    try {
      console.log("Fetching invitations for organization:", "page:", page)

      const api = createApiClient()
      const response = await api.get(
        `/invitations/paginated?page=${page}&search=${search}&role=${role}`,
      )

      if (response.status !== 200) {
        throw new Error("Failed to fetch invitations")
      }

      return response.data
    } catch (error: unknown) {
      const messageFallback = (error as Error).message ?? "An error occurred"
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data.message ??
        messageFallback

      throw new Error(errorMessage)
    }
  },
)
