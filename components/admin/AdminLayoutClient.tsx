"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import CustomizationProvider from "@/components/customization/CustomizationProvider";
import { getAdminPageKey } from "@/lib/customization-admin-registry";
import { resolveAdminTheme } from "@/lib/dashboard-theme";
import type { GlobalOverrides, PageOverrides } from "@/lib/customization-types";

interface AdminUser {
  name?: string;
  email?: string;
  role?: string;
  mustChangePassword?: boolean;
}

interface AdminLayoutClientProps {
  user: AdminUser;
  children: React.ReactNode;
  customizationGlobal?: GlobalOverrides;
  initialPageKey?: string;
  initialSections?: PageOverrides;
  allAdminSections?: Record<string, PageOverrides>;
}

export default function AdminLayoutClient({
  user,
  children,
  customizationGlobal = {},
  initialPageKey = "dashboard",
  initialSections = {},
  allAdminSections = {},
}: AdminLayoutClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pageKey = getAdminPageKey(pathname) || "dashboard";

  // Preloaded admin page customizations guarantee immediate styling without network flash
  const sections = useMemo(() => {
    return allAdminSections[pageKey] || (pageKey === initialPageKey ? initialSections : {});
  }, [allAdminSections, pageKey, initialPageKey, initialSections]);

  const adminTheme = useMemo(() => {
    return resolveAdminTheme(customizationGlobal, sections.page);
  }, [customizationGlobal, sections.page]);

  // Client-side guard for seeded admin with mustChangePassword: true
  useEffect(() => {
    if (user.mustChangePassword && pathname !== "/admin/change-password") {
      router.replace("/admin/change-password");
    }
  }, [user.mustChangePassword, pathname, router]);

  return (
    <CustomizationProvider
      scope="admin"
      pageKey={pageKey}
      global={customizationGlobal}
      sections={sections}
      allSections={allAdminSections}
    >
      <div
        className="min-h-screen bg-[#F8F9FA] text-stone-900 flex"
        style={adminTheme.cssVariables as React.CSSProperties}
      >
      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <AdminSidebar
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
        />

        <main data-customization-section="page" className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
    </CustomizationProvider>
  );
}
