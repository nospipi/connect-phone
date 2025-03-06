import Link from "next/link"

const Page = async () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <span>HOME PAGE</span>
      <Link href="/org_id/overview">/org_id/overview</Link>
      <Link href="/select-organization">/select-organization</Link>
    </div>
  )
}

export default Page
