import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select"
import { Organization } from "@clerk/nextjs/server"

const OrganizationsSelector = () => {
  const data = [
    {
      value: "organization-name-1",
      label: "Organization Name 1",
    },
    {
      value: "organization-name-2",
      label: "Organization Name 2",
    },
  ]

  return (
    <Select value="organization-name-1">
      <SelectTrigger>
        <SelectValue placeholder="Select Organization" />
      </SelectTrigger>
      <SelectContent>
        <div className="flex flex-col gap-2">
          <span
            className={
              "px-3 py-2 text-blue-700 outline-none transition-colors data-[state=checked]:font-semibold sm:text-xs dark:text-blue-400"
            }
          >
            Organizations ({data.length})
          </span>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )
}

export default OrganizationsSelector
