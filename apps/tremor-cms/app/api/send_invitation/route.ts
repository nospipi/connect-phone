import axios from "axios"

export async function GET() {
  try {
    const response = await axios.post(
      "https://api.clerk.com/v1/invitations",
      {
        email_address: "getaways.magonezos@gmail.com",
        redirect_url: "/",
        public_metadata: { role: "admin" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )

    console.log("Supabase keep-alive operation successful")
    return Response.json({
      message: "Supabase keep-alive operation successful",
    })
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred"
    console.error(message)
    return Response.json({ error: message }, { status: 400 })
  }
}
