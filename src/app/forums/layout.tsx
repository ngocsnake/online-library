import LandingPageLayout from "@/components/layouts/LandingPageLayout";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LandingPageLayout>
      <div
        style={{
          marginTop: 84,
          height: "100%",
          padding: "32px 0",
        }}
      >
        {children}
      </div>
    </LandingPageLayout>
  );
}
