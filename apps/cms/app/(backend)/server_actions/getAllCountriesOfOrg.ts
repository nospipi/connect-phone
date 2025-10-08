// apps/cms/app/(backend)/server_actions/getAllCountriesOfOrg.ts
"use server"

import { AxiosError } from "axios"
import { ICountry } from "@connect-phone/shared-types"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//--------------------------------------------------------------------------------

export const getAllCountriesOfOrg = async (): Promise<ICountry[]> => {
  try {
    const api = createApiClient()
    const response = await api.get("/countries")

    if (response.status !== 200) {
      throw new Error("Failed to fetch countries")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting countries:", errorMessage)
    throw new Error(errorMessage)
  }
}
