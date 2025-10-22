// apps/cms/app/(backend)/server_actions/offer-exclusions/createOfferExclusion.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const createOfferExclusion = async (
  formData: FormData,
): Promise<void> => {
  try {
    const body = formData.get("body") as string

    if (!body) {
      throw new Error("Body is required")
    }

    const api = createApiClient()
    const response = await api.post("/offer-exclusions/new", {
      body,
    })

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create offer exclusion")
    }

    revalidatePath("/inventory/offer-exclusions")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create offer exclusion:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offer-exclusions")
}
