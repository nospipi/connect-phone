//apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/test-rich-editor/TinyEditor.tsx

"use client"

import { useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import type { Editor as TinyMCEEditor } from "tinymce"

export default function TinyEditor({
  initialContent = "",
}: {
  initialContent?: string
}) {
  const editorRef = useRef<TinyMCEEditor | null>(null)

  const handleLogContent = (): void => {
    if (editorRef.current) {
      const content = editorRef.current.getContent()
      console.log("Editor output:", content)
    }
  }

  return (
    <div>
      <Editor
        initialValue={initialContent}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_evt, editor) => {
          editorRef.current = editor
        }}
        init={{
          height: 400,
          menubar: false,
          //   content_css: "dark",
          skin: "oxide-dark",
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
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | image| help",
        }}
      />

      <button
        onClick={handleLogContent}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Log Editor Output
      </button>
    </div>
  )
}
