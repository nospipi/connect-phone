// apps/cms/app/(backend)/server_actions/esim-offers/updateEsimOffer.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updateEsimOffer = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const title = formData.get("title") as string
    const descriptionHtml = formData.get("descriptionHtml") as string
    const descriptionText = formData.get("descriptionText") as string
    const durationInDays = formData.get("durationInDays") as string
    const dataInGb = formData.get("dataInGb") as string
    const isUnlimitedData = formData.get("isUnlimitedData") as string
    const inclusionIds = formData.get("inclusionIds") as string
    const exclusionIds = formData.get("exclusionIds") as string
    const mainImageId = formData.get("mainImageId") as string
    const imageIds = formData.get("imageIds") as string
    const countryIds = formData.get("countryIds") as string
    const salesChannelIds = formData.get("salesChannelIds") as string
    const priceIds = formData.get("priceIds") as string

    const payload: Record<string, any> = {}

    if (title) {
      payload.title = title
    }
    if (descriptionHtml) {
      payload.descriptionHtml = descriptionHtml
    }
    if (descriptionText) {
      payload.descriptionText = descriptionText
    }
    if (durationInDays) {
      payload.durationInDays = parseInt(durationInDays, 10)
    }
    if (dataInGb) {
      payload.dataInGb = parseFloat(dataInGb)
    }
    if (isUnlimitedData !== null && isUnlimitedData !== undefined) {
      payload.isUnlimitedData = isUnlimitedData === "true"
    }
    if (inclusionIds) {
      payload.inclusionIds = JSON.parse(inclusionIds)
    }
    if (exclusionIds) {
      payload.exclusionIds = JSON.parse(exclusionIds)
    }
    if (mainImageId !== undefined) {
      payload.mainImageId = mainImageId ? parseInt(mainImageId, 10) : null
    }
    if (imageIds) {
      payload.imageIds = JSON.parse(imageIds)
    }
    if (countryIds) {
      payload.countryIds = JSON.parse(countryIds)
    }
    if (salesChannelIds) {
      payload.salesChannelIds = JSON.parse(salesChannelIds)
    }
    if (priceIds) {
      payload.priceIds = JSON.parse(priceIds)
    }

    const api = createApiClient()
    const response = await api.put(`/esim-offers/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update eSIM offer")
    }

    revalidatePath("/inventory/offers")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update eSIM offer:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offers")
}
