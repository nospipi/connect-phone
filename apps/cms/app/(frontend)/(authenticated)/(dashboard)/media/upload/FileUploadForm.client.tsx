// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/upload/FileUploadForm.client.tsx
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  RiUploadLine,
  RiCloseLine,
  RiImageLine,
  RiLoader4Line,
  RiCheckLine,
  RiAlertLine,
} from "@remixicon/react"
import Link from "next/link"
import Image from "next/image"
import { uploadMedia } from "@/app/(backend)/server_actions/media/uploadMedia"

//----------------------------------------------------------------------

interface FilePreview {
  file: File
  preview: string
  error?: string
}

const MAX_FILES = 5

export default function FileUploadForm() {
  const router = useRouter()
  const [files, setFiles] = useState<FilePreview[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [limitError, setLimitError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<{
    show: boolean
    count: number
  } | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const totalFiles = files.length + selectedFiles.length

    setUploadSuccess(null)
    setUploadError(null)

    if (totalFiles > MAX_FILES) {
      setLimitError(`You can only upload up to ${MAX_FILES} images.`)
      e.target.value = ""
      return
    } else {
      setLimitError(null)
    }

    const previews: FilePreview[] = selectedFiles.map((file) => {
      let error: string | undefined

      if (file.size > 1 * 1024 * 1024) {
        error = "File exceeds 1MB"
      } else if (!file.type.startsWith("image/")) {
        error = "Not an image file"
      }

      return {
        file,
        preview: URL.createObjectURL(file),
        error,
      }
    })

    setFiles((prev) => [...prev, ...previews])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
    setLimitError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setUploadSuccess(null)
    setUploadError(null)

    if (files.length === 0) {
      setUploadError("No files selected")
      return
    }

    const validFiles = files.filter((f) => !f.error)
    if (validFiles.length === 0) {
      setUploadError("No valid files to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress({ current: 0, total: validFiles.length })

    try {
      const formData = new FormData(e.currentTarget)

      for (let i = 0; i < validFiles.length; i++) {
        const filePreview = validFiles[i]
        const description = formData.get(`description-${i}`) as string | null

        const uploadFormData = new FormData()
        uploadFormData.append("file", filePreview.file)
        if (description) uploadFormData.append("description", description)

        setUploadProgress({ current: i + 1, total: validFiles.length })
        await uploadMedia(uploadFormData)
      }

      files.forEach((f) => URL.revokeObjectURL(f.preview))
      if (fileInputRef.current) fileInputRef.current.value = ""

      setUploadSuccess({ show: true, count: validFiles.length })
      setFiles([])
      setUploadProgress({ current: 0, total: 0 })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed"
      setUploadError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const validFilesCount = files.filter((f) => !f.error).length

  return (
    <div className="relative">
      {uploadSuccess?.show && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/50">
                <RiCheckLine className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Upload complete
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-200">
                Successfully uploaded {uploadSuccess.count}{" "}
                {uploadSuccess.count === 1 ? "image" : "images"}
              </p>
            </div>
            <button
              onClick={() => setUploadSuccess(null)}
              className="text-sm text-green-600 underline hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/50">
                <RiAlertLine
                  className="text-red-600 dark:text-red-400"
                  size={14}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Upload failed
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                {uploadError}
              </p>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="files"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Images
          </label>
          <input
            ref={fileInputRef}
            id="files"
            name="files"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading || files.length >= MAX_FILES}
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:file:bg-gray-600 dark:file:text-gray-200 dark:hover:file:bg-gray-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            You can upload up to {MAX_FILES} images. Each file must be 1MB or
            less.
          </p>
          {limitError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {limitError}
            </p>
          )}
        </div>

        {files.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Images ({files.length}/{MAX_FILES})
              </h3>
              {validFilesCount < files.length && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {files.length - validFilesCount} file
                  {files.length - validFilesCount !== 1 ? "s" : ""} will be
                  skipped
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {files.map((filePreview, index) => (
                <div
                  key={index}
                  className={`rounded-lg border bg-white p-4 dark:bg-gray-800 ${
                    filePreview.error
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="flex-shrink-0">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                        {filePreview.preview ? (
                          <Image
                            src={filePreview.preview}
                            alt={filePreview.file.name}
                            fill
                            className="object-scale-down p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <RiImageLine className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {filePreview.file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(filePreview.file.size / 1024).toFixed(1)} KB
                          </p>
                          {filePreview.error && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {filePreview.error}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                          <RiCloseLine className="h-4 w-4" />
                        </button>
                      </div>

                      {!filePreview.error && (
                        <textarea
                          name={`description-${index}`}
                          rows={2}
                          placeholder="Add description..."
                          disabled={isUploading}
                          className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="mediaRightsAcknowledgement"
              required
              disabled={isUploading}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I confirm that I have the rights to upload and use these images,
              and that they do not violate any copyright, trademark, or other
              intellectual property rights.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
          <Link
            href="/media"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={
              isUploading || files.length === 0 || files.every((f) => f.error)
            }
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RiUploadLine className="mr-2 h-4 w-4" />
            {isUploading
              ? "Uploading..."
              : `Upload ${validFilesCount} ${validFilesCount === 1 ? "Image" : "Images"}`}
          </button>
        </div>
      </form>

      {isUploading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm">
          <RiLoader4Line className="mb-4 h-10 w-10 animate-spin text-white" />
          <p className="mb-1 text-lg font-semibold text-white">
            Uploading your files...
          </p>
          <p className="text-sm text-gray-200">
            {uploadProgress.current} of {uploadProgress.total} uploaded
          </p>
          <p className="mt-4 text-xs italic text-gray-300">
            Please don&apos;t close or refresh this page
          </p>
        </div>
      )}
    </div>
  )
}
