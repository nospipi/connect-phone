// apps/cms/app/(backend)/server_actions/getCountryById.ts
"use server"

import { AxiosError } from "axios"
import { ICountry } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//--------------------------------------------------------------------------------

export const getCountryById = async (countryId: number): Promise<ICountry> => {
  try {
    console.log("Fetching country by ID:", countryId)

    const api = createApiClient()
    const response = await api.get(`/countries/${countryId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch country")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting country by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
