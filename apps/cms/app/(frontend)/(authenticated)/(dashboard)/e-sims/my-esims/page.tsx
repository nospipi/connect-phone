import { Card } from "@/components/common/Card"
import { Badge } from "@/components/common/Badge"
import { Button } from "@/components/common/Button"
import { ProgressBar } from "@/components/common/ProgressBar"

// Placeholder data for user's active e-sims
const placeholderMyEsims = [
  {
    id: 1,
    title: "Global Data Plan",
    iccid: "8901234567890123456",
    status: "Active",
    remainingData: 15.2, // GB
    totalData: 20, // GB
    expiryDate: "2025-11-15",
    countries: ["USA", "UK", "Germany"],
    purchaseDate: "2025-10-01",
  },
  {
    id: 2,
    title: "Europe Explorer",
    iccid: "8901234567890123457",
    status: "Active",
    remainingData: null, // Unlimited
    totalData: null,
    expiryDate: "2025-10-20",
    countries: ["France", "Germany", "Italy"],
    purchaseDate: "2025-10-10",
  },
  {
    id: 3,
    title: "Asia Connect",
    iccid: "8901234567890123458",
    status: "Expired",
    remainingData: 0,
    totalData: 5,
    expiryDate: "2025-10-25",
    countries: ["Japan", "South Korea"],
    purchaseDate: "2025-10-18",
  },
]

const Page = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your active e-SIM cards and monitor usage.
        </p>
      </div>

      <div className="space-y-6">
        {placeholderMyEsims.map((esim) => (
          <Card key={esim.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {esim.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ICCID: {esim.iccid}
                </p>
              </div>
              <Badge
                variant={
                  esim.status === "Active"
                    ? "success"
                    : esim.status === "Expired"
                    ? "error"
                    : "neutral"
                }
              >
                {esim.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Data Usage
                </span>
                {esim.totalData ? (
                  <div className="mt-2">
                    <ProgressBar
                      value={(esim.remainingData! / esim.totalData) * 100}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-900 dark:text-gray-50">
                      {esim.remainingData} GB / {esim.totalData} GB remaining
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-50 mt-2">
                    Unlimited data
                  </p>
                )}
              </div>

              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Expiry Date
                </span>
                <p className="text-sm text-gray-900 dark:text-gray-50 mt-2">
                  {new Date(esim.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Covered Countries
              </span>
              <div className="mt-2 flex flex-wrap gap-1">
                {esim.countries.map((country) => (
                  <Badge key={country} variant="neutral" className="text-xs">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Purchased: {new Date(esim.purchaseDate).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-xs px-2 py-1">
                  View Details
                </Button>
                {esim.status === "Active" && (
                  <Button variant="secondary" className="text-xs px-2 py-1">
                    Top Up
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {placeholderMyEsims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No active e-SIMs found. Visit the Marketplace to purchase one.
          </p>
        </div>
      )}
    </div>
  )
}

export default Page
