// apps/cms/app/(backend)/server_actions/updateUser.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { IUser } from "@connect-phone/shared-types"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

export const updateUser = async (formData: FormData): Promise<void> => {
  try {
    // Extract form data
    const id = Number(formData.get("id"))
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    console.log("Updating user:", {
      id,
      firstName,
      lastName,
      email,
      role,
    })

    // const api = createApiClient()
    // const response = await api.put(`/users/${id}`, {
    //   id,
    //   firstName: firstName || undefined,
    //   lastName: lastName || undefined,
    //   email: email || undefined,
    //   role: role || undefined,
    // })

    // if (response.status !== 200) {
    //   throw new Error("Failed to update user")
    // }

    // console.log("User updated successfully:", response.data)

    // Revalidate the users page after updating
    revalidatePath("/users")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update user:", errorMessage)
    throw new Error(errorMessage)
  }
}
