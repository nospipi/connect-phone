// apps/cms/app/(backend)/server_actions/media/deleteMediaById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteMediaById = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("mediaId"))
    console.log("Deleting media with ID:", id)

    const api = createApiClient()
    const response = await api.delete(`/media/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete media")
    }

    revalidatePath("/media")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete media:", errorMessage)
    throw new Error(errorMessage)
  }
}
