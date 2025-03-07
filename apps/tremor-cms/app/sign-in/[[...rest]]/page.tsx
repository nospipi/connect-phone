import { SignIn } from "@clerk/nextjs"

const Page = async () => {
  // console.log("Invitation")

  // const invitation = await axios.post(
  //   "https://api.clerk.com/v1/invitations",
  //   {
  //     email_address: "nospipian@gmail.com",
  //     redirect_url: "/",
  //     public_metadata: { role: "admin" },
  //   },
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   },
  // )

  // console.log("Invitation created:", invitation)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <SignIn />
    </div>
  )
}

export default Page
