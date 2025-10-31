import { Card } from "@/components/common/Card"
import { Badge } from "@/components/common/Badge"

// Placeholder data for e-sim offers
const placeholderEsimOffers = [
  {
    id: 1,
    title: "Global Data Plan",
    description: "Unlimited data in 100+ countries",
    durationInDays: 30,
    dataInGb: null,
    isUnlimitedData: true,
    price: 29.99,
    countries: ["USA", "UK", "Germany", "France"],
  },
  {
    id: 2,
    title: "Europe Explorer",
    description: "High-speed data across Europe",
    durationInDays: 15,
    dataInGb: 10,
    isUnlimitedData: false,
    price: 19.99,
    countries: ["France", "Germany", "Italy", "Spain"],
  },
  {
    id: 3,
    title: "Asia Connect",
    description: "Stay connected in Asia",
    durationInDays: 7,
    dataInGb: 5,
    isUnlimitedData: false,
    price: 14.99,
    countries: ["Japan", "South Korea", "Thailand"],
  },
  {
    id: 4,
    title: "Americas Roam",
    description: "Data coverage in North and South America",
    durationInDays: 30,
    dataInGb: 20,
    isUnlimitedData: false,
    price: 34.99,
    countries: ["USA", "Canada", "Mexico", "Brazil"],
  },
]

const Page = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your e-SIM offers and view marketplace options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {placeholderEsimOffers.map((offer) => (
          <Card key={offer.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {offer.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {offer.description}
              </p>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duration:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {offer.durationInDays} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Data:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {offer.isUnlimitedData ? "Unlimited" : `${offer.dataInGb} GB`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Price:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  ${offer.price}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Countries:
              </span>
              <div className="mt-2 flex flex-wrap gap-1">
                {offer.countries.slice(0, 3).map((country) => (
                  <Badge key={country} variant="neutral" className="text-xs">
                    {country}
                  </Badge>
                ))}
                {offer.countries.length > 3 && (
                  <Badge variant="neutral" className="text-xs">
                    +{offer.countries.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="success">Active</Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ID: {offer.id}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
