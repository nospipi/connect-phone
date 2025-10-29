// apps/cms/app/(backend)/server_actions/date-ranges/getDateRangesByIds.ts
"use server"

import { AxiosError } from "axios"
import { IDateRange } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//------------------------------------------------------------

export const getDateRangesByIds = async (
  ids: number[],
): Promise<IDateRange[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("ids", ids.join(","))
    console.log("Fetching date ranges with IDs:", ids.join(","))

    const response = await api.get(`/date-ranges/by-ids?${params.toString()}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch date ranges by IDs")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting date ranges by IDs:", errorMessage)
    throw new Error(errorMessage)
  }
}
