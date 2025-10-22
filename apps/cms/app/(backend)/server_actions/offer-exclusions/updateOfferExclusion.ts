// apps/cms/app/(backend)/server_actions/offer-exclusions/updateOfferExclusion.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updateOfferExclusion = async (
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
    const response = await api.put(`/offer-exclusions/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update offer exclusion")
    }

    revalidatePath("/inventory/offer-exclusions")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update offer exclusion:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offer-exclusions")
}
