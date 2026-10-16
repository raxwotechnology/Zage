import type { GlobalOverrides, SectionOverride } from "./customization-types";

export function normalizeHex(color?: string, fallback = "#03BF62"): string {
  if (!color || typeof color !== "string") return fallback;
  const trimmed = color.trim();
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^([0-9a-fA-F]{3}){1,2}$/.test(trimmed)) {
    return `#${trimmed}`;
  }
  return fallback;
}

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = normalizeHex(hex);
  let clean = normalized.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function adjustColor(hex: string, amount: number): string {
  const normalized = normalizeHex(hex);
  let clean = normalized.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getRgbComponents(color?: string, fallback = "#03BF62"): { r: number; g: number; b: number } {
  const normalized = normalizeHex(color, fallback);
  let clean = normalized.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export interface AdminThemeVariables {
  primaryColor: string;
  primaryHover: string;
  iconColor: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder?: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarActiveIcon: string;
  sidebarBg?: string;
  headerBg?: string;
  cssVariables: Record<string, string>;
}

export function resolveAdminTheme(
  global: GlobalOverrides = {},
  section?: SectionOverride
): AdminThemeVariables {
  const websiteStyle = global.adminWebsite?.style;
  const headerStyle = global.adminHeader?.style;
  const sidebarStyle = global.adminSidebar?.style;
  const sectionStyle = section?.style;

  const primaryColor = normalizeHex(
    sectionStyle?.iconColor ||
    sectionStyle?.primaryButton?.backgroundColor ||
    websiteStyle?.iconColor ||
    websiteStyle?.primaryButton?.backgroundColor ||
    headerStyle?.iconColor,
    "#03BF62"
  );

  const { r, g, b } = getRgbComponents(primaryColor);
  const primaryHover = adjustColor(primaryColor, -15);

  const buttonBg = normalizeHex(
    sectionStyle?.primaryButton?.backgroundColor ||
    websiteStyle?.primaryButton?.backgroundColor,
    primaryColor
  );

  const buttonText = normalizeHex(
    sectionStyle?.primaryButton?.textColor ||
    websiteStyle?.primaryButton?.textColor,
    "#FFFFFF"
  );

  const buttonBorder = sectionStyle?.primaryButton?.borderColor ||
    websiteStyle?.primaryButton?.borderColor ||
    buttonBg;

  const iconColor = normalizeHex(
    sectionStyle?.iconColor ||
    websiteStyle?.iconColor ||
    headerStyle?.iconColor,
    primaryColor
  );

  const sidebarActiveBg = normalizeHex(
    sidebarStyle?.activeItemBackground,
    primaryColor
  );

  const sidebarActiveText = normalizeHex(
    sidebarStyle?.activeItemTextColor,
    "#FFFFFF"
  );

  const sidebarActiveIcon = normalizeHex(
    sidebarStyle?.activeItemIconColor ||
    sidebarStyle?.activeItemTextColor,
    "#FFFFFF"
  );

  const cssVariables: Record<string, string> = {
    "--admin-theme": primaryColor,
    "--admin-theme-rgb": `${r}, ${g}, ${b}`,
    "--admin-primary": primaryColor,
    "--admin-primary-hover": primaryHover,
    "--admin-hover-border": `rgba(${r}, ${g}, ${b}, 0.55)`,
    "--admin-hover-glow": `0 6px 20px -2px rgba(${r}, ${g}, ${b}, 0.32)`,
    "--admin-button-bg": buttonBg,
    "--admin-button-text": buttonText,
    "--admin-button-border": buttonBorder,
    "--admin-icon-color": iconColor,
    "--admin-sidebar-active-bg": sidebarActiveBg,
    "--admin-sidebar-active-text": sidebarActiveText,
    "--admin-sidebar-active-icon": sidebarActiveIcon,
  };

  if (sidebarStyle?.backgroundColor) {
    cssVariables["--admin-sidebar-bg"] = sidebarStyle.backgroundColor;
  }
  if (headerStyle?.backgroundColor) {
    cssVariables["--admin-header-bg"] = headerStyle.backgroundColor;
  }

  return {
    primaryColor,
    primaryHover,
    iconColor,
    buttonBg,
    buttonText,
    buttonBorder,
    sidebarActiveBg,
    sidebarActiveText,
    sidebarActiveIcon,
    sidebarBg: sidebarStyle?.backgroundColor,
    headerBg: headerStyle?.backgroundColor,
    cssVariables,
  };
}

