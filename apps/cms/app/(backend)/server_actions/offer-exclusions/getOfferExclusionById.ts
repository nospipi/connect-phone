// apps/cms/app/(backend)/server_actions/offer-exclusions/getOfferExclusionById.ts
"use server"

import { AxiosError } from "axios"
import { IOfferExclusion } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getOfferExclusionById = async (
  offerExclusionId: number,
): Promise<IOfferExclusion> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/offer-exclusions/${offerExclusionId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch offer exclusion")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting offer exclusion by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
