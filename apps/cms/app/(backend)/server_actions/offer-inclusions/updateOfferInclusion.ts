// apps/cms/app/(backend)/server_actions/offer-inclusions/updateOfferInclusion.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updateOfferInclusion = async (
  formData: FormData,
): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const body = formData.get("body") as string

    const payload: Record<string, string> = {}

    if (body) {
      payload.body = body
    }

    const api = createApiClient()
    const response = await api.put(`/offer-inclusions/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update offer inclusion")
    }

    revalidatePath("/inventory/offer-inclusions")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update offer inclusion:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offer-inclusions")
}
