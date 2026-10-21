import "server-only";
import { cache } from "react";
import { connectDB } from "./mongodb";
import SalonSettings, {
  normalizePageVisibility,
  type IPageVisibilitySettings,
} from "@/models/SalonSettings";

export interface PublicSalonSettings {
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

/**
 * Server-side helper to load salon branding and configuration for public layouts.
 * Uses React cache() for request-level deduplication so multiple callers within
 * the same render share a single MongoDB query.
 */
export const getSalonSettings = cache(async (): Promise<PublicSalonSettings> => {
  try {
    await connectDB();
    const settings = await SalonSettings.findOne().lean();

    return {
      salonName: settings?.salonName || "Salon Zage",
      headerLogo: settings?.logo || "",
      footerLogo: settings?.footerLogo || settings?.logo || "",
      favicon: settings?.favicon || "",
      externalSystem: {
        loginUrl: settings?.externalSystem?.loginUrl || "",
        registerUrl: settings?.externalSystem?.registerUrl || "",
        bookingUrl: settings?.externalSystem?.bookingUrl || "",
      },
      pageVisibility: normalizePageVisibility(settings?.pageVisibility),
    };
  } catch (error) {
    console.error("Failed to load salon settings server-side:", error);
    return {
      salonName: "Salon Zage",
      headerLogo: "",
      footerLogo: "",
      favicon: "",
      externalSystem: {
        loginUrl: "",
        registerUrl: "",
        bookingUrl: "",
      },
      pageVisibility: normalizePageVisibility(null),
    };
  }
});
