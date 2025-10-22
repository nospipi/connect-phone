// apps/cms/app/(backend)/server_actions/offer-inclusions/deleteOfferInclusionById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteOfferInclusionById = async (
  formData: FormData,
): Promise<void> => {
  try {
    const id = Number(formData.get("offerInclusionId"))

    const api = createApiClient()
    const response = await api.delete(`/offer-inclusions/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete offer inclusion")
    }

    revalidatePath("/inventory/offer-inclusions")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete offer inclusion:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offer-inclusions")
}
