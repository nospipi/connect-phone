import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Footer from "./Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      disableCollapsibleSidebar
      slots={{
        sidebarFooter: Footer,
      }}
    >
      <PageContainer>{children}</PageContainer>
    </DashboardLayout>
  );
}
