// apps/cms/app/(backend)/server_actions/organizations/deleteAllCache.ts

"use server"

import { AxiosError } from "axios"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//------------------------------------------------------------

interface DeleteCacheResponse {
  success: boolean
  deletedCount: number
}

export const deleteAllCache = async (): Promise<DeleteCacheResponse> => {
  try {
    const api = createApiClient()
    const response = await api.delete("/organizations/cache")

    if (response.status !== 200) {
      throw new Error("Failed to delete cache")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete cache:", errorMessage)
    throw new Error(errorMessage)
  }
}
