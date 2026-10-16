import { publicPages as rawPublicPages } from "./customization-public-registry";
import { adminPages } from "./customization-admin-registry";
import type { CustomizationScope, GlobalGroupKey, GlobalRegistration, PageRegistration } from "./customization-types";
import type { CloudinaryFolder } from "./cloudinary-constants";

export const publicPages: PageRegistration[] = rawPublicPages.map((page) => ({
  ...page,
  sections: page.sections.map((section) => ({
    ...section,
    styles: section.styles.includes("iconColor") ? section.styles : [...section.styles, "iconColor" as const],
  })),
}));
export { adminPages };

export const globalGroups: GlobalRegistration[] = [
  { key: "publicHeader", label: "Public Header", scope: "public", styles: ["backgroundColor", "backgroundImage", "textColor", "iconColor", "activeLinkColor", "hoverColor", "primaryButton"] },
  { key: "publicWebsite", label: "Public Website", scope: "public", styles: ["backgroundColor", "textColor", "headingColor", "iconColor", "headingFont", "bodyFont"] },
  { key: "publicFooter", label: "Public Footer", scope: "public", styles: ["backgroundColor", "backgroundImage", "textColor", "headingColor", "linkColor", "accentColor", "iconColor"] },
  { key: "adminHeader", label: "Admin Header", scope: "admin", styles: ["backgroundColor", "textColor", "iconColor"] },
  { key: "adminSidebar", label: "Admin Sidebar", scope: "admin", styles: ["backgroundColor", "textColor", "iconColor", "activeItemBackground", "activeItemTextColor", "activeItemIconColor", "hoverBackground"] },
  { key: "adminWebsite", label: "Admin Website", scope: "admin", styles: ["backgroundColor", "textColor", "headingColor", "iconColor", "headingFont", "bodyFont", "primaryButton"] },
];

export function isCustomizationScope(scope: string): scope is CustomizationScope {
  return scope === "public" || scope === "admin";
}

export function getPageRegistration(scope: string, pageKey: string) {
  if (!isCustomizationScope(scope)) return undefined;
  return (scope === "public" ? publicPages : adminPages).find((page) => page.key === pageKey);
}

export function getSectionRegistration(scope: string, pageKey: string, sectionKey: string) {
  const page = getPageRegistration(scope, pageKey);
  if (!page) return undefined;
  return page.sections.find((section) =>
    section.key === sectionKey ||
    (section.key === "wedding-beauty" && (sectionKey === "weddingBeauty" || sectionKey === "wedding" || sectionKey === "weddingPreview")) ||
    (section.key === "weddingBeauty" && sectionKey === "wedding-beauty")
  );
}

export function getGlobalRegistration(group: string) {
  return globalGroups.find((entry) => entry.key === group);
}

export function getCustomizationFolder(scope: CustomizationScope, pageKey: string, sectionKey: string): CloudinaryFolder {
  const reg = getSectionRegistration(scope, pageKey, sectionKey);
  if (!reg) throw new Error("Unknown customization section");
  return `salon-management/customization/${scope}/${pageKey}/${reg.key}`;
}

export function isCustomizationFolder(folder: string): boolean {
  if (folder === "salon-management/customization/global") return true;
  const match = /^salon-management\/customization\/(public|admin)\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(folder);
  if (!match) return false;
  const section = getSectionRegistration(match[1], match[2], match[3]);
  return Boolean(section?.styles.includes("backgroundImage") || section?.media?.includes("sectionImage"));
}

export function customizationPagePath(scope: CustomizationScope, pageKey: string) {
  if (scope === "admin") return pageKey === "dashboard" ? "/admin" : `/admin/${pageKey}`;
  return pageKey === "home" ? "/" : `/${pageKey}`;
}

export function isGlobalGroupKey(value: string): value is GlobalGroupKey {
  return Boolean(getGlobalRegistration(value));
}
