// apps/cms/app/(backend)/server_actions/esim-offers/getEsimOffersByIds.ts
"use server"

import { AxiosError } from "axios"
import { IEsimOffer } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//------------------------------------------------------------

export const getEsimOffersByIds = async (
  ids: number[],
): Promise<IEsimOffer[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("ids", ids.join(","))
    console.log("Fetching eSIM offers with IDs:", ids.join(","))

    const response = await api.get(`/esim-offers/by-ids?${params.toString()}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch eSIM offers by IDs")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting eSIM offers by IDs:", errorMessage)
    throw new Error(errorMessage)
  }
}
