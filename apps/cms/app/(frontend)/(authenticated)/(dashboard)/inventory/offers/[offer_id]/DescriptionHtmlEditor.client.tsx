// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/[offer_id]/DescriptionHtmlEditor.client.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

//------------------------------------------------------------

const TinyEditor = dynamic(() => import("./TinyEditor.client"), {
  ssr: false,
  loading: () => (
    <div className="mt-2 flex h-[300px] w-full items-center justify-center border border-gray-300 bg-white dark:border-slate-700/50 dark:bg-slate-900/50">
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Loading editor...
      </p>
    </div>
  ),
})

interface DescriptionHtmlEditorProps {
  initialValue: string
  offerId: string
}

export default function DescriptionHtmlEditor({
  initialValue,
  offerId,
}: DescriptionHtmlEditorProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialValue)

  const handleChange = (newContent: string) => {
    setContent(newContent)

    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    formData.forEach((value, key) => {
      if (key !== "descriptionHtml") {
        const stringValue = String(value)
        if (stringValue.startsWith("[") && stringValue.endsWith("]")) {
          try {
            const parsed = JSON.parse(stringValue)
            if (Array.isArray(parsed) && parsed.length > 0) {
              urlParams.set(key, parsed.join(","))
            }
          } catch {}
        } else if (stringValue) {
          urlParams.set(key, stringValue)
        }
      }
    })

    if (newContent) {
      urlParams.set("descriptionHtml", newContent)
    }

    router.replace(`/inventory/offers/${offerId}?${urlParams.toString()}`, {
      scroll: false,
    })
  }

  return (
    <>
      <input type="hidden" name="descriptionHtml" value={content} />
      <div className="mt-2">
        <TinyEditor initialValue={initialValue} onChange={handleChange} />
      </div>
    </>
  )
}
