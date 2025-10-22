import TinyEditor from "./TinyEditor"
import initialContent from "./preload_test"

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">TinyMCE Rich Text Test</h1>
      <TinyEditor initialContent={initialContent} />
    </div>
  )
}
