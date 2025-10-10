// apps/cms/app/(backend)/server_actions/date-ranges/updateDateRange.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

export const updateDateRange = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const name = formData.get("name") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string

    const payload: Record<string, string> = {}

    if (name) {
      payload.name = name
    }
    if (startDate) {
      payload.startDate = startDate
    }
    if (endDate) {
      payload.endDate = endDate
    }

    console.log("Updating date range:", {
      id,
      ...payload,
    })

    const api = createApiClient()
    const response = await api.put(`/date-ranges/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update date range")
    }

    console.log("Date range updated successfully:", response.data)

    revalidatePath("/inventory/calendar")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update date range:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/calendar")
}
