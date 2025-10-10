// apps/cms/app/(backend)/server_actions/createDateRange.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

export const createDateRange = async (formData: FormData): Promise<void> => {
  try {
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string

    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required")
    }

    console.log("Creating new date range:", {
      startDate,
      endDate,
    })

    const api = createApiClient()
    const response = await api.post("/date-ranges/new", {
      startDate,
      endDate,
    })

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create date range")
    }

    console.log("Date range created successfully:", response.data)

    revalidatePath("/inventory/date-ranges")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create date range:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/date-ranges")
}
