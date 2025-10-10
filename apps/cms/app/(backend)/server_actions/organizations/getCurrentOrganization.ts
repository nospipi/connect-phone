// apps/cms/app/(backend)/server_actions/getCurrentOrganization.ts
"use server"

import { AxiosError } from "axios"
import { IOrganization } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//--------------------------------------------------------------------------------

export const getCurrentOrganization =
  async (): Promise<IOrganization | null> => {
    try {
      const api = createApiClient()
      const response = await api.get(`/organizations/current`)

      if (response.status !== 200) {
        throw new Error("Failed to fetch current organization")
      }

      return response.data || null
    } catch (error: unknown) {
      const messageFallback = (error as Error).message ?? "An error occurred"
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data.message ??
        messageFallback

      console.error("Error getting current organization:", errorMessage)
      throw new Error(errorMessage)
    }
  }
