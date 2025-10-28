"use client"

import { useEffect, useRef, useState } from "react"
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
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Detect Tailwind dark mode via class on <html> or <body>
    const root = document.documentElement // or document.body if you toggle there

    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark"))
    })

    // Initial check
    setIsDarkMode(root.classList.contains("dark"))

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Editor
      key={isDarkMode ? "dark" : "light"} // 👈 Re-initialize TinyMCE when mode changes
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 800,
        menubar: true,
        skin: isDarkMode ? "oxide-dark" : "oxide",
        content_css: isDarkMode ? "dark" : "default",
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
          "undo redo | blocks | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={(content) => onChange(content)}
    />
  )
}
