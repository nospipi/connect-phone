// apps/cms/app/(backend)/server_actions/esim-offers/getEsimOfferById.ts
"use server"

import { AxiosError } from "axios"
import { IEsimOffer } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getEsimOfferById = async (
  esimOfferId: number,
): Promise<IEsimOffer> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/esim-offers/${esimOfferId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch eSIM offer")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting eSIM offer by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
