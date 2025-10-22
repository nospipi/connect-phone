// apps/cms/app/(backend)/server_actions/esim-offers/deleteEsimOfferById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteEsimOfferById = async (
  formData: FormData,
): Promise<void> => {
  try {
    const id = Number(formData.get("esimOfferId"))

    const api = createApiClient()
    const response = await api.delete(`/esim-offers/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete eSIM offer")
    }

    revalidatePath("/inventory/offers")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete eSIM offer:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offers")
}
