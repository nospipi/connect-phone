// apps/cms/app/(backend)/server_actions/prices/updatePrice.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updatePrice = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const name = formData.get("name") as string
    const amount = formData.get("amount") as string
    const currency = formData.get("currency") as string
    const isDateBased = formData.get("isDateBased") as string
    const salesChannelIds = formData.get("salesChannelIds") as string
    const dateRangeIds = formData.get("dateRangeIds") as string

    const payload: Record<string, any> = {}

    if (name) {
      payload.name = name
    }
    if (amount) {
      payload.amount = parseFloat(amount)
    }
    if (currency) {
      payload.currency = currency
    }
    if (isDateBased !== undefined) {
      payload.isDateBased = isDateBased === "true"
    }
    if (salesChannelIds) {
      payload.salesChannelIds = JSON.parse(salesChannelIds)
    }
    if (dateRangeIds) {
      payload.dateRangeIds = JSON.parse(dateRangeIds)
    }

    const api = createApiClient()
    const response = await api.put(`/prices/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update price")
    }

    revalidatePath("/prices")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update price:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/prices")
}
