import { Suspense } from "react";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LinearProgress from "@mui/material/LinearProgress";
import type { Navigation } from "@toolpad/core/AppProvider";
import theme from "../theme";

//DOCS
//https://mui.com/toolpad/core/react-dashboard-layout/

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  { kind: "divider" },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
];

const BRANDING = {
  logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
  title: "My Toolpad Core Next.js App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Suspense fallback={<LinearProgress />}>
            <NextAppProvider
              navigation={NAVIGATION}
              session={null}
              branding={BRANDING}
              theme={theme}
            >
              {children}
            </NextAppProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
