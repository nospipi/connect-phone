import { notFound } from "next/navigation"

export default function CatchAll() {
  notFound() // Will render (dashboard)/not-found.tsx instead of the global one
}
