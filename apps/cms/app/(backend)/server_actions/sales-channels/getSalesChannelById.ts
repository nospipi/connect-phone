// apps/cms/app/(backend)/server_actions/getSalesChannelById.ts
"use server"

import { AxiosError } from "axios"
import { ISalesChannel } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//--------------------------------------------------------------------------------

export const getSalesChannelById = async (
  salesChannelId: number,
): Promise<ISalesChannel> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/sales-channels/${salesChannelId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch sales channel")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting sales channel by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
