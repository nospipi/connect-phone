"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import logo from "@/public/logo.png"
import Image from "next/image"
import { upload } from "@vercel/blob/client"
import { type PutBlobResult } from "@vercel/blob"
import { useRouter } from "next/navigation"
import { addLogoUrlToOrganization } from "@/components/app/server_actions"

//----------------------------------------------------------------------

export default function LogoUpload({ orgId }: { orgId: string }) {
  const router = useRouter()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [ipConfirmed, setIpConfirmed] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Countdown timer effect
  useEffect(() => {
    if (uploadCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (uploadCompleted && countdown === 0) {
      router.push(`/${orgId}/overview`)
    }
  }, [uploadCompleted, countdown, orgId, router])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }

  // Handle form submission for upload
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!fileInputRef.current?.files || !fileInputRef.current.files[0]) {
      setUploadError("No file selected")
      return
    }

    const file = fileInputRef.current.files[0]

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setUploadError(null)

      // Generate a unique filename
      const filename = `org-logos/${orgId}/${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`

      // Upload to Vercel Blob with progress tracking
      const newBlob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent) => {
          console.log(`Loaded ${progressEvent.loaded} bytes`)
          console.log(`Total ${progressEvent.total} bytes`)
          console.log(`Percentage ${progressEvent.percentage}%`)
          setUploadProgress(Math.round(progressEvent.percentage))
        },
      })

      await addLogoUrlToOrganization(newBlob.url)

      // Set the uploaded blob
      setBlob(newBlob)
      setUploadCompleted(true)
      setIsUploading(false)
      setUploadProgress(100)

      // Start countdown
      setCountdown(15)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="group relative mb-4">
        <div
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-100 transition-colors group-hover:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
          style={
            logoPreview
              ? {
                  backgroundImage: `url(${logoPreview})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {}
          }
        >
          {!logoPreview && (
            <div className="p-2 text-center text-sm text-gray-400">
              <Image
                src={logo}
                alt="logo"
                width={50}
                height={50}
                className="transition-all duration-200 dark:invert"
              />
            </div>
          )}
        </div>
      </div>

      {!uploadCompleted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="mt-4 flex items-start space-x-2 self-start">
            <input
              type="checkbox"
              id="ip-confirm"
              name="ip-confirm"
              checked={ipConfirmed}
              onChange={(e) => {
                setIpConfirmed(e.target.checked)
                // If it's false, remove the preview
                if (!e.target.checked) {
                  setLogoPreview(null)
                  setBlob(null)
                }
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
              disabled={isUploading}
            />
            <label
              htmlFor="ip-confirm"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              I confirm that I own the rights to this image, and I take full
              responsibility for sharing it
            </label>
          </div>

          <div className="mt-4">
            <input
              type="file"
              id="logo-upload"
              name="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={`mx-auto block w-full text-center text-sm ${
                ipConfirmed
                  ? "text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-600 hover:file:bg-indigo-100 focus:outline-none dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-indigo-400 dark:hover:file:bg-gray-700"
                  : "cursor-not-allowed text-gray-400 opacity-70 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-400 dark:text-gray-600 dark:file:bg-gray-900 dark:file:text-gray-600"
              }`}
              disabled={!ipConfirmed || isUploading}
              required
            />
            <p className="mt-2 text-center text-xs text-gray-500">
              Recommended: Square image, at least 512x512px (Max 4MB)
            </p>
          </div>

          <button
            type="submit"
            disabled={
              !ipConfirmed || isUploading || !fileInputRef.current?.files?.[0]
            }
            className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              ipConfirmed && fileInputRef.current?.files?.[0] && !isUploading
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "cursor-not-allowed bg-indigo-400"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Logo"}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-xs">
          <Link href={`/${orgId}/overview`}>
            <button className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              Continue to Dashboard
            </button>
          </Link>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting in <span className="font-semibold">{countdown}</span>{" "}
              seconds
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1 rounded-full bg-indigo-600 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 15) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress and Status - Using inline Tailwind styles */}
      {(isUploading || (uploadCompleted && !isUploading) || uploadError) && (
        <div className="mt-4 w-full max-w-xs rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {isUploading && (
            <>
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                Uploading ...
              </p>
              <div className="w-full">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-300 ease-in-out dark:bg-indigo-500"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-right text-xs text-gray-500">
                  {uploadProgress}%
                </div>
              </div>
            </>
          )}

          {uploadCompleted && !isUploading && (
            <div className="flex items-center gap-2 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p className="text-sm">Upload complete!</p>
              {blob && (
                <a
                  href={blob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-blue-600 underline hover:text-blue-800"
                >
                  View
                </a>
              )}
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-sm">{uploadError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
