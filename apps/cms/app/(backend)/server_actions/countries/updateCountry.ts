// apps/cms/app/(backend)/server_actions/updateCountry.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updateCountry = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const flagAvatarUrl = formData.get("flagAvatarUrl") as string
    const flagProductImageUrl = formData.get("flagProductImageUrl") as string

    const payload: Record<string, string | null> = {}

    // Only include fields that have values or are being cleared
    if (flagAvatarUrl !== undefined && flagAvatarUrl !== null) {
      payload.flagAvatarUrl = flagAvatarUrl || null
    }
    if (flagProductImageUrl !== undefined && flagProductImageUrl !== null) {
      payload.flagProductImageUrl = flagProductImageUrl || null
    }

    const api = createApiClient()
    const response = await api.put(`/countries/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update country")
    }

    revalidatePath("/countries")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update country:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/countries")
}
