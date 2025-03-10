"use server"

import { User } from "db"
import axios, { AxiosInstance, AxiosError } from "axios"
import { auth } from "@clerk/nextjs/server"

interface ErrorResponse {
  message: string
}

const createApiClient = (organizationId: string): AxiosInstance => {
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
      // Use the provided organizationId
      config.headers.Organization = organizationId
    } catch (error) {
      console.error("Error getting authentication token:", error)
    }

    return config
  })

  return api
}

//----------------------------------------------------------------------

export async function getAllUsers(organizationId: string): Promise<User[]> {
  console.log("Getting all users...", organizationId)
  try {
    const api = createApiClient(organizationId)
    // const { getToken } = await auth()
    // const token = await getToken()

    const response = await api.get("/users")
    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }
}
