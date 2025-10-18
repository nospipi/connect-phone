// apps/cms/app/(backend)/server_actions/media/uploadMedia.ts
"use server"

import { AxiosError } from "axios"
import { IMedia } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const uploadMedia = async (formData: FormData): Promise<IMedia> => {
  try {
    const file = formData.get("file") as File
    const description = formData.get("description") as string | null

    if (!file) {
      throw new Error("No file provided")
    }

    const api = createApiClient()

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    if (description) {
      uploadFormData.append("description", description)
    }

    const response = await api.post("/media/new", uploadFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to upload media")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to upload media:", errorMessage)
    throw new Error(errorMessage)
  }
}
