// apps/cms/app/(backend)/server_actions/getDateRangeById.ts
"use server"

import { AxiosError } from "axios"
import { IDateRange } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getDateRangeById = async (
  dateRangeId: number,
): Promise<IDateRange> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/date-ranges/${dateRangeId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch date range")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting date range by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
