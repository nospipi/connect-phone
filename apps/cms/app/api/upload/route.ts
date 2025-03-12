import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import axios from "axios"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  const { getToken } = await auth()
  const token = await getToken()

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        // Generate a client token for the browser to upload the file
        // You should authenticate and authorize users before generating the token

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/av",
          ],
          maximumSizeInBytes: 1024 * 1024 * 4, // 4MB,
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth
            timestamp: Date.now(),
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const { url } = blob
          //NOT WORKING ON LOCALHOST
          //await new Promise((resolve) => setTimeout(resolve, 5000))
          console.log("blob upload completed", blob, tokenPayload)
          await axios.get("http://localhost:3001/users/test", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
          return
        } catch (error) {
          throw new Error("Could not update user")
        }
      },
    })

    console.log("Blob upload response:", jsonResponse)

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Blob upload error:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    )
  }
}

// Required for Vercel Blob
export const runtime = "edge"
