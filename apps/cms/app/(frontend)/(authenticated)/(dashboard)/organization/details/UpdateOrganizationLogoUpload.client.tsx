// apps/cms/app/(frontend)/(authenticated)/(dashboard)/organization/details/UpdateOrganizationLogoUpload.client.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { upload } from "@vercel/blob/client"
import { type PutBlobResult } from "@vercel/blob"
import { useRouter } from "next/navigation"
import {
  RiImageLine,
  RiDragDropLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
} from "@remixicon/react"

interface UpdateOrganizationLogoUploadProps {
  currentLogoUrl: string
  organizationId: string | undefined
}

export default function UpdateOrganizationLogoUpload({
  currentLogoUrl,
  organizationId,
}: UpdateOrganizationLogoUploadProps) {
  const router = useRouter()
  const [logoPreview, setLogoPreview] = useState<string | null>(
    currentLogoUrl || null,
  )
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentLogoUrl) {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [currentLogoUrl])

  const handleFileSelection = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    if (file.size > 1 * 1024 * 1024) {
      setUploadError("File size must be less than 1MB")
      return
    }

    try {
      const dimensions = await getImageDimensions(file)

      if (dimensions.width !== 256 || dimensions.height !== 256) {
        setUploadError("Image must be exactly 256x256 pixels")
        return
      }

      console.log(`Image dimensions: ${dimensions.width}x${dimensions.height}`)
    } catch (error) {
      setUploadError("Could not read image dimensions")
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
    setUploadError(null)

    await handleUpload(file)
  }

  const getImageDimensions = (
    file: File,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
        URL.revokeObjectURL(img.src)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
        URL.revokeObjectURL(img.src)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleFileSelection(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelection(files[0])

      if (fileInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(files[0])
        fileInputRef.current.files = dt.files
      }
    }
  }

  const handleUpload = async (file?: File) => {
    const uploadFile = file || fileInputRef.current?.files?.[0]

    if (!uploadFile) {
      setUploadError("No file selected")
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setUploadError(null)

      const timestamp = Date.now()
      const filename = `organization-logos/${organizationId}/${timestamp}-${uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`

      const newBlob: PutBlobResult = await upload(filename, uploadFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round(progressEvent.percentage))
        },
      })

      const searchParams = new URLSearchParams()
      searchParams.set("logoUrl", newBlob.url)

      router.push(`/organization/details?${searchParams.toString()}`)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
      setIsUploading(false)
    }
  }

  const handleClearLogo = () => {
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    const searchParams = new URLSearchParams()
    searchParams.set("logoUrl", "clear")

    router.push(`/organization/details?${searchParams.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
          isDragOver
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : logoPreview
              ? "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
              : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
        } ${isUploading ? "pointer-events-none opacity-75" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="flex items-center justify-center p-8">
          {logoPreview ? (
            <div className="flex w-full items-center gap-6">
              <div className="relative flex-shrink-0">
                <div
                  className="h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  style={{
                    backgroundImage: `url(${logoPreview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>

              <div className="flex-1 text-left">
                <p className="mt-1 text-sm text-gray-500">
                  Click anywhere to change or drag a new image here
                </p>
                <a
                  href={currentLogoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <RiExternalLinkLine className="h-3 w-3" />
                  View image
                </a>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearLogo()
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-300 bg-red-50 text-red-600 shadow-sm hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-700 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-800/50 dark:hover:text-red-300"
                >
                  <RiDeleteBinLine className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                {isDragOver ? (
                  <RiDragDropLine className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <RiImageLine className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {isDragOver
                    ? "Drop your logo here"
                    : "Upload organization logo"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Click to browse or drag and drop an image
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Required: Exactly 256x256px (Max 1MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {isUploading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Uploading logo...
            </p>
            <span className="text-sm text-blue-700 dark:text-blue-200">
              {uploadProgress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300 ease-in-out dark:bg-blue-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            Upload failed
          </p>
          <p className="text-sm text-red-700 dark:text-red-200">
            {uploadError}
          </p>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
