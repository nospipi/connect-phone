// apps/cms/app/(backend)/server_actions/sales-channels/getSalesChannelsByIds.ts
"use server"

import { AxiosError } from "axios"
import { ISalesChannel } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//------------------------------------------------------------

export const getSalesChannelsByIds = async (
  ids: number[],
): Promise<ISalesChannel[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("ids", ids.join(","))
    console.log("Fetching sales channels with IDs:", ids.join(","))

    const response = await api.get(
      `/sales-channels/by-ids?${params.toString()}`,
    )

    if (response.status !== 200) {
      throw new Error("Failed to fetch sales channels by IDs")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting sales channels by IDs:", errorMessage)
    throw new Error(errorMessage)
  }
}
