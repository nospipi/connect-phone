// apps/cms/app/(backend)/server_actions/prices/getPriceById.ts
"use server"

import { AxiosError } from "axios"
import { IPrice } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getPriceById = async (priceId: number): Promise<IPrice> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/prices/${priceId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch price")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting price by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
