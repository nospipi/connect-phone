import axios from "axios"

const Page = async () => {
  try {
    console.log("Invitation")

    const invitation = await axios.post(
      "https://api.clerk.com/v1/invitations",
      {
        email_address: "nospipian@gmail.com",
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

    console.log("Invitation created:", invitation.data)
  } catch (error) {
    return <div>Invitation failed</div>
  }

  return (
    <div>
      <span>SIGNIN PAGE</span>
    </div>
  )
}

export default Page
