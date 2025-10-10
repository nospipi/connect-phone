// apps/cms/app/(backend)/server_actions/isUserLoggedInOrganization.ts

"use server"

import { AxiosError } from "axios"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//--------------------------------------------------------------------------------

export const isUserLoggedInOrganization = async (): Promise<{
  loggedIn: boolean
}> => {
  try {
    const api = createApiClient()
    const response = await api.get("/users/logged-organization")

    if (response.status !== 200) {
      throw new Error("Failed to check user organization status")
    }

    return response.data || { loggedIn: false }
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting user organization status:", errorMessage)
    throw new Error(errorMessage)
  }
}
