// app/setup/actions.ts
"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// First async operation
export async function stepOne() {
  const cookieStore = await cookies()

  // Simulate some async work
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Update cookie
  cookieStore.set("setupStep", "1")
  cookieStore.set("stepOneComplete", "true")

  // Revalidate to update UI
  revalidatePath("/setup-organization")

  return { success: true }
}

// Second async operation
export async function stepTwo() {
  const cookieStore = await cookies()

  // Simulate some async work
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Update cookie
  cookieStore.set("setupStep", "2")
  cookieStore.set("stepTwoComplete", "true")

  // Revalidate to update UI
  revalidatePath("/setup-organization")

  return { success: true }
}

// Third async operation
export async function stepThree() {
  const cookieStore = await cookies()

  // Simulate some async work
  await new Promise((resolve) => setTimeout(resolve, 1800))

  // Update cookie
  cookieStore.set("setupStep", "3")
  cookieStore.set("setupComplete", "true")

  // Revalidate to update UI
  revalidatePath("/setup-organization")

  return { success: true }
}

// Get current step
export async function getCurrentStep() {
  const cookieStore = await cookies()

  const currentStep = cookieStore.get("setupStep")?.value || "0"
  const complete = cookieStore.get("setupComplete")?.value === "true"

  return {
    step: parseInt(currentStep),
    complete,
  }
}

export async function resetSetup() {
  const cookieStore = await cookies()

  // Clear all setup-related cookies
  cookieStore.delete("setupStep")
  cookieStore.delete("stepOneComplete")
  cookieStore.delete("stepTwoComplete")
  cookieStore.delete("setupComplete")

  // Revalidate to update UI
  revalidatePath("/setup-organization")

  return { success: true }
}
