import { products } from "./organization/mockData"

export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/overview",
    overview: "/overview",
    inventory: {
      products: "/inventory/products",
      packages: "/inventory/packages",
    },
    e_sims: {
      my_e_sims: "/e-sims/my-esims",
      marketplace: "/e-sims/marketplace",
    },
    settings: {
      general: "/settings/general",
      billing: "/settings/billing",
      users: "/settings/users",
    },
  },
}

export type siteConfig = typeof siteConfig
