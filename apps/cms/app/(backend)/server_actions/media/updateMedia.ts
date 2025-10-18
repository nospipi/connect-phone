// apps/cms/app/(backend)/server_actions/media/updateMedia.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updateMedia = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const description = formData.get("description") as string

    const payload: Record<string, string | null> = {}

    if (description !== undefined && description !== null) {
      payload.description = description || null
    }

    const api = createApiClient()
    const response = await api.put(`/media/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update media")
    }

    revalidatePath("/media")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update media:", errorMessage)
    throw new Error(errorMessage)
  }
}
