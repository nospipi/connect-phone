import Link from "next/link"

//-------------------------------------------------------------------

const Page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) //simulate loading
  return (
    <div>
      Media Page
      <Link href="/media/select">Go to Select Media Page</Link>
    </div>
  )
}

export default Page
