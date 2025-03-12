import { clerkClient, auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const clerk = await clerkClient()

    const response = await clerk.users.updateUserMetadata(userId || "", {
      publicMetadata: {
        example: "this has been updated by the API",
      },
      privateMetadata: {
        example: "this has been updated by the API",
      },
    })

    return Response.json({
      message: "Ok",
    })
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred"
    console.error(message)
    return Response.json({ error: message }, { status: 400 })
  }
}
