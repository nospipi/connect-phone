// apps/cms/app/(backend)/server_actions/prices/getPricesByIds.ts
"use server"

import { AxiosError } from "axios"
import { IPrice } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//------------------------------------------------------------

export const getPricesByIds = async (ids: number[]): Promise<IPrice[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("ids", ids.join(","))
    console.log("Fetching prices with IDs:", ids.join(","))

    const response = await api.get(`/prices/by-ids?${params.toString()}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch prices by IDs")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting prices by IDs:", errorMessage)
    throw new Error(errorMessage)
  }
}
