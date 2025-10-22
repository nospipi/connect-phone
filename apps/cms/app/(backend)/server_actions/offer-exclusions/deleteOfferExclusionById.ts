// apps/cms/app/(backend)/server_actions/offer-exclusions/deleteOfferExclusionById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteOfferExclusionById = async (
  formData: FormData,
): Promise<void> => {
  try {
    const id = Number(formData.get("offerExclusionId"))

    const api = createApiClient()
    const response = await api.delete(`/offer-exclusions/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete offer exclusion")
    }

    revalidatePath("/inventory/offer-exclusions")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete offer exclusion:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offer-exclusions")
}
