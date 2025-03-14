export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/org_id/overview",
    overview: "/org_id/overview",
    details: "/org_id/details",
    settings: {
      general: "org_id/settings/general",
      billing: "/org_id/settings/billing",
      users: "/org_id/settings/users",
    },
  },
}

export type siteConfig = typeof siteConfig
