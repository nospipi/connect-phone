// apps/cms/app/(backend)/server_actions/offer-inclusions/getOfferInclusionById.ts
"use server"

import { AxiosError } from "axios"
import { IOfferInclusion } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getOfferInclusionById = async (
  offerInclusionId: number,
): Promise<IOfferInclusion> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/offer-inclusions/${offerInclusionId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch offer inclusion")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting offer inclusion by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
