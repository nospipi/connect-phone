"use server"

import { User } from "db"
import axios, { AxiosInstance, AxiosError } from "axios"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect, permanentRedirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth, currentUser } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { first } from "lodash"
const BACKEND_URL = process.env.BACKEND_URL

interface ErrorResponse {
  message: string
}

const createApiClient = (organizationId?: string): AxiosInstance => {
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
      // Use the provided organizationId to be used in Organization guard in nest backend
      config.headers.Organization = organizationId
    } catch (error) {
      console.error("Error getting authentication token:", error)
    }

    return config
  })

  return api
}

//----------------------------------------------------------------------

export const getAllUsers = async (organizationId: string): Promise<User[]> => {
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

export const createOrganization = async (formData: FormData): Promise<void> => {
  let organizationId: string = "0" // Default fallback ID

  try {
    const api = createApiClient()
    const response = await api.post("/organizations", formData)

    organizationId = response.data.id
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }

  // redirect returns error by default, so cant be used in the try block
  redirect(`/create-organization/${organizationId}/add-logo`)
}

export const createBlankUser = async (): Promise<void> => {
  try {
    const api = createApiClient()
    const user = await currentUser()

    const payload = {
      email: user?.primaryEmailAddress?.emailAddress,
      firstName: user?.firstName,
      lastName: user?.lastName,
    }

    console.log("Creating blank user...", payload)

    await api.post("/users/create_blank", payload)
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }

  // redirect returns error by default, so cant be used in the try block
  redirect(`/create-organization`)
}

export const isLoggedUserInDb = async (): Promise<void> => {
  try {
    const api = createApiClient()
    const Dbuser = await api.get(`/users/logged_user_in_db`)
    return Dbuser.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }
}
