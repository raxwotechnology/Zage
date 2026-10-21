"use client";

import React, { createContext, useContext, useState } from "react";
import type { IPageVisibilitySettings } from "@/models/SalonSettings";

export interface WebsiteSettingsData {
  salonName: string;
  headerLogo: string;
  footerLogo: string;
  favicon?: string;
  externalSystem: {
    loginUrl: string;
    registerUrl: string;
    bookingUrl: string;
  };
  pageVisibility: IPageVisibilitySettings;
}

const defaultWebsiteSettings: WebsiteSettingsData = {
  salonName: "Salon Zage",
  headerLogo: "",
  footerLogo: "",
  favicon: "",
  externalSystem: {
    loginUrl: "",
    registerUrl: "",
    bookingUrl: "",
  },
  pageVisibility: {
    products: true,
    promotions: true,
    wedding: true,
    vendors: true,
    gallery: true,
  },
};

const WebsiteSettingsContext = createContext<WebsiteSettingsData>(defaultWebsiteSettings);

export function WebsiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings?: Partial<WebsiteSettingsData>;
  children: React.ReactNode;
}) {
  const [settings] = useState<WebsiteSettingsData>(() => ({
    salonName: initialSettings?.salonName || defaultWebsiteSettings.salonName,
    headerLogo: initialSettings?.headerLogo || defaultWebsiteSettings.headerLogo,
    footerLogo: initialSettings?.footerLogo || defaultWebsiteSettings.footerLogo,
    favicon: initialSettings?.favicon || defaultWebsiteSettings.favicon,
    externalSystem: {
      loginUrl: initialSettings?.externalSystem?.loginUrl || defaultWebsiteSettings.externalSystem.loginUrl,
      registerUrl: initialSettings?.externalSystem?.registerUrl || defaultWebsiteSettings.externalSystem.registerUrl,
      bookingUrl: initialSettings?.externalSystem?.bookingUrl || defaultWebsiteSettings.externalSystem.bookingUrl,
    },
    pageVisibility: {
      products:
        initialSettings?.pageVisibility?.products !== undefined
          ? Boolean(initialSettings.pageVisibility.products)
          : defaultWebsiteSettings.pageVisibility.products,
      promotions:
        initialSettings?.pageVisibility?.promotions !== undefined
          ? Boolean(initialSettings.pageVisibility.promotions)
          : defaultWebsiteSettings.pageVisibility.promotions,
      wedding:
        initialSettings?.pageVisibility?.wedding !== undefined
          ? Boolean(initialSettings.pageVisibility.wedding)
          : defaultWebsiteSettings.pageVisibility.wedding,
      vendors:
        initialSettings?.pageVisibility?.vendors !== undefined
          ? Boolean(initialSettings.pageVisibility.vendors)
          : defaultWebsiteSettings.pageVisibility.vendors,
      gallery:
        initialSettings?.pageVisibility?.gallery !== undefined
          ? Boolean(initialSettings.pageVisibility.gallery)
          : defaultWebsiteSettings.pageVisibility.gallery,
    },
  }));

  return (
    <WebsiteSettingsContext.Provider value={settings}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings(): WebsiteSettingsData {
  return useContext(WebsiteSettingsContext);
}
