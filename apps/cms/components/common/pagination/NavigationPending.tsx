// apps/cms/components/common/NavigationPending.tsx

"use client"

import { useEffect, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import DotsLoading from "../DotsLoading"

//------------------------------------------------------------

interface NavigationPendingProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NavigationPending({
  href,
  children,
  className = "",
}: NavigationPendingProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // Reset pending state when route changes
  }, [pathname, searchParams])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <a href={href} onClick={handleClick} className={`relative ${className}`}>
      {children}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/50 dark:bg-slate-900/50">
          <DotsLoading />
        </div>
      )}
    </a>
  )
}
