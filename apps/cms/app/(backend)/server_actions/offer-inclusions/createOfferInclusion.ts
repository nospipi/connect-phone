// apps/cms/app/(backend)/server_actions/offer-inclusions/createOfferInclusion.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const createOfferInclusion = async (
  formData: FormData,
): Promise<void> => {
  try {
    const body = formData.get("body") as string

    if (!body) {
      throw new Error("Body is required")
    }

    const api = createApiClient()
    const response = await api.post("/offer-inclusions/new", {
      body,
    })

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create offer inclusion")
    }

    revalidatePath("/inventory/offer-inclusions")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create offer inclusion:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offer-inclusions")
}
