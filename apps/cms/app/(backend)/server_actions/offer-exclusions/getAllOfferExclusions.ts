// apps/cms/app/(backend)/server_actions/offer-exclusions/getAllOfferExclusions.ts
"use server"

import { AxiosError } from "axios"
import { IOfferExclusion } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getAllOfferExclusions = async (): Promise<IOfferExclusion[]> => {
  try {
    const api = createApiClient()
    const response = await api.get("/offer-exclusions/all")

    if (response.status !== 200) {
      throw new Error("Failed to fetch offer exclusions")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch offer exclusions:", errorMessage)
    throw new Error(errorMessage)
  }
}
