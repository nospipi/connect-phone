import { clerkClient, auth } from "@clerk/nextjs/server"
const BACKEND_URL = process.env.BACKEND_URL
import axios, { AxiosInstance, AxiosError } from "axios"
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/server_actions"

export async function GET(request: Request) {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await getAllSalesChannelsOfOrganizationPaginated({
      cursor: 1,
      pageSize: 10,
      organizationId: 3,
    })

    return Response.json(response)
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred"
    console.error(message)
    return Response.json({ error: message }, { status: 400 })
  }
}
