// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/create-new/TinyEditor.client.tsx
"use client"

import { useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Editor as TinyMCEEditor } from "tinymce"

//------------------------------------------------------------

interface TinyEditorProps {
  initialValue: string
  onChange: (content: string) => void
}

export default function TinyEditor({
  initialValue,
  onChange,
}: TinyEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null)

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={(content) => onChange(content)}
    />
  )
}
