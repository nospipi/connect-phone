// apps/cms/app/(backend)/server_actions/prices/createPrice.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { IPrice } from "@connect-phone/shared-types"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const createPrice = async (formData: FormData): Promise<void> => {
  try {
    const name = formData.get("name") as string
    const amount = formData.get("amount") as string
    const currency = formData.get("currency") as string
    const isDateBased = formData.get("isDateBased") as string
    const salesChannelIds = formData.get("salesChannelIds") as string
    const dateRangeIds = formData.get("dateRangeIds") as string

    if (!name || !amount || !currency || !salesChannelIds) {
      throw new Error("Name, amount, currency and sales channels are required")
    }

    const payload = {
      name,
      amount: parseFloat(amount),
      currency,
      isDateBased: isDateBased === "true",
      salesChannelIds: JSON.parse(salesChannelIds),
      dateRangeIds: dateRangeIds ? JSON.parse(dateRangeIds) : [],
    }

    console.log("Creating new price:", payload)

    const api = createApiClient()
    const response = await api.post("/prices/new", payload)

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create price")
    }

    console.log("Price created successfully:", response.data)

    revalidatePath("/inventory/prices")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create price:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/prices")
}
