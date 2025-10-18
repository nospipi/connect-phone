// apps/cms/app/(backend)/server_actions/media/getMediaById.ts
"use server"

import { AxiosError } from "axios"
import { IMedia } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const getMediaById = async (mediaId: number): Promise<IMedia> => {
  try {
    const api = createApiClient()
    const response = await api.get(`/media/${mediaId}`)

    if (response.status !== 200) {
      throw new Error("Failed to fetch media")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting media by ID:", errorMessage)
    throw new Error(errorMessage)
  }
}
