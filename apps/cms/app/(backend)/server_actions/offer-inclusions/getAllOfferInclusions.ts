// apps/cms/app/(backend)/server_actions/offer-inclusions/getAllOfferInclusions.ts
"use server"

import { AxiosError } from "axios"
import { IOfferInclusion } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getAllOfferInclusions = async (): Promise<IOfferInclusion[]> => {
  try {
    const api = createApiClient()
    const response = await api.get("/offer-inclusions/all")

    if (response.status !== 200) {
      throw new Error("Failed to fetch offer inclusions")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to fetch offer inclusions:", errorMessage)
    throw new Error(errorMessage)
  }
}
