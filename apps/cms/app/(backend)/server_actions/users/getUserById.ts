// apps/cms/app/(backend)/server_actions/getUserById.ts
"use server"

import { AxiosError } from "axios"
import { IUserWithOrganizationRole } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//--------------------------------------------------------------------------------

export const getUserById = async (
  userId: number,
): Promise<IUserWithOrganizationRole> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/users/${userId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch user")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting user by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
