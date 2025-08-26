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

export const logoutUserFromOrganization = async (): Promise<void> => {
  try {
    console.log("Logging user out of organization")
    const api = createApiClient()
    const response = await api.patch(`/users/log-out-organization`)

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to log user out of organization")
    }
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to log user out of organization:", errorMessage)
    redirect(`/?error=${encodeURIComponent(errorMessage)}`)
  }

  //redirect("/")
}
