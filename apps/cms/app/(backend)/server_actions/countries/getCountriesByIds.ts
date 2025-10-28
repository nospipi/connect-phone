// apps/cms/app/(backend)/server_actions/countries/getCountriesByIds.ts
"use server"

import { AxiosError } from "axios"
import { ICountry } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//------------------------------------------------------------

export const getCountriesByIds = async (ids: number[]): Promise<ICountry[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const api = createApiClient()
    const params = new URLSearchParams()
    params.append("ids", ids.join(","))

    const response = await api.get(`/countries/by-ids?${params.toString()}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch countries by IDs")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting countries by IDs:", errorMessage)
    throw new Error(errorMessage)
  }
}
