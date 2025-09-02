"use server"

import axios, { AxiosInstance, AxiosError } from "axios"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


//----------------------------------------------------------------------

interface ErrorResponse {
  message: string
}

//--------------------------------------------------------------

const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  api.interceptors.request.use(async (config) => {
    try {
      const { getToken } = await auth()
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error("Error getting authentication token:", error)
    }

    return config
  })

  return api
}

//----------------------------------------------------------------------

export const createNewSalesChannel = async (
  formData: FormData,
): Promise<void> => {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoUrl = formData.get("logoUrl") as string

    // Validate required fields
    if (!name) {
      throw new Error("Name is required")
    }

    console.log("Creating new sales channel:", {
      name,
      description: description || undefined,
      logoUrl: logoUrl || undefined,
    })

    const api = createApiClient()
    const response = await api.post("/sales-channels/new", {
      name,
      description: description || undefined,
      logoUrl: logoUrl || undefined,
    })

    console.log("Response from API:", response.data)

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create sales channel")
    }

    console.log("Sales channel created successfully:", response.data)

    // Revalidate the sales channels page after creating a new one
    revalidatePath("/sales-channels")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create sales channel:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/sales-channels")
}
