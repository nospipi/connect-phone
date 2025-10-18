// apps/cms/app/(backend)/server_actions/prices/deletePriceById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deletePriceById = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("priceId"))

    const api = createApiClient()
    const response = await api.delete(`/prices/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete price")
    }

    revalidatePath("/prices")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete price:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/prices")
}
