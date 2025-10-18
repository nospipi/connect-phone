// server_actions/getAllAuditLogsOfOrganizationPaginated.ts
"use server"

import { AxiosError } from "axios"
import { ErrorResponse, PaginatedAuditLogsResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

interface PaginationParams {
  page?: string | number
}

export const getAllAuditLogsOfOrganizationPaginated = async ({
  page = 1,
}: PaginationParams): Promise<PaginatedAuditLogsResponse> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/audit-logs/paginated?page=${page}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch audit logs")
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
