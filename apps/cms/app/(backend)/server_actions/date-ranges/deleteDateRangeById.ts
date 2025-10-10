// apps/cms/app/(backend)/server_actions/deleteDateRangeById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteDateRangeById = async (
  formData: FormData,
): Promise<void> => {
  try {
    const id = Number(formData.get("dateRangeId"))
    console.log("Deleting date range with ID:", id)

    const api = createApiClient()
    const response = await api.delete(`/date-ranges/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete date range")
    }

    console.log("Date range deleted successfully:", response.data)

    revalidatePath("/inventory/date-ranges")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete date range:", errorMessage)
    throw new Error(errorMessage)
  } finally {
    redirect("/inventory/date-ranges")
  }
}
