// apps/cms/components/common/PendingOverlay.tsx

"use client"

import { useFormStatus } from "react-dom"
import { useTransition, FormEvent } from "react"
import { useRouter } from "next/navigation"
import DotsLoading from "./DotsLoading"

//------------------------------------------------------------

type PendingMode = "form" | "navigation" | "custom" | "form-navigation"

interface PendingOverlayProps {
  mode: PendingMode
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  isPending?: boolean
  formId?: string
}

function FormPendingWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <div className={`relative ${className}`}>
      {children}
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900">
          <DotsLoading />
        </div>
      )}
    </div>
  )
}

function NavigationPendingWrapper({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode
  href: string
  className?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer ${className}`}
    >
      {children}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900">
          <DotsLoading />
        </div>
      )}
    </div>
  )
}

function FormNavigationWrapper({
  children,
  className = "",
  formId,
}: {
  children: React.ReactNode
  className?: string
  formId?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    const form = formId
      ? (document.getElementById(formId) as HTMLFormElement)
      : null

    if (!form) {
      console.error("Form not found")
      return
    }

    const formData = new FormData(form)
    const params = new URLSearchParams()

    formData.forEach((value, key) => {
      if (value) {
        params.set(key, value.toString())
      }
    })

    const currentPath = window.location.pathname
    const queryString = params.toString()
    const url = queryString ? `${currentPath}?${queryString}` : currentPath

    startTransition(() => {
      router.push(url)
    })
  }

  return (
    <div onClick={handleClick} className={`relative ${className}`}>
      {children}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900">
          <DotsLoading />
        </div>
      )}
    </div>
  )
}

function CustomPendingWrapper({
  children,
  onClick,
  className = "",
  isPending = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  isPending?: boolean
}) {
  const [internalPending, startTransition] = useTransition()

  const handleClick = () => {
    if (onClick) {
      startTransition(() => {
        onClick()
      })
    }
  }

  const pending = isPending || internalPending

  return (
    <div onClick={handleClick} className={`relative ${className}`}>
      {children}
      {pending && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-white dark:bg-slate-900">
          <DotsLoading />
        </div>
      )}
    </div>
  )
}

export function PendingOverlay({
  mode,
  children,
  href,
  onClick,
  className = "",
  isPending,
  formId,
}: PendingOverlayProps) {
  if (mode === "form") {
    return (
      <FormPendingWrapper className={className}>{children}</FormPendingWrapper>
    )
  }

  if (mode === "navigation") {
    if (!href) {
      throw new Error("href is required for navigation mode")
    }
    return (
      <NavigationPendingWrapper href={href} className={className}>
        {children}
      </NavigationPendingWrapper>
    )
  }

  if (mode === "form-navigation") {
    return (
      <FormNavigationWrapper className={className} formId={formId}>
        {children}
      </FormNavigationWrapper>
    )
  }

  if (mode === "custom") {
    return (
      <CustomPendingWrapper
        onClick={onClick}
        className={className}
        isPending={isPending}
      >
        {children}
      </CustomPendingWrapper>
    )
  }

  return <>{children}</>
}
