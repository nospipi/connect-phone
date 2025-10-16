// server_actions/getAllOrganizationsOfUser.ts

"use server"

import { AxiosError } from "axios"
import { IOrganizationWithUserRole } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//--------------------------------------------------------------------------------

export const getAllOrganizationsOfUser = async (): Promise<
  IOrganizationWithUserRole[]
> => {
  try {
    const api = createApiClient()
    const response = await api.get("/users/organizations")

    if (response.status !== 200) {
      throw new Error("Failed to fetch user organizations")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting user organizations:", errorMessage)
    throw new Error(errorMessage)
  }
}
