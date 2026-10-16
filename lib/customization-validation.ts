import { CUSTOMIZATION_FONTS } from "./customization-types";
import type { BackgroundImageStyle, ContentField, CustomizationFont, SectionMedia, SectionOverride, SectionRegistration, SectionStyle } from "./customization-types";
import { getGlobalRegistration, getSectionRegistration, getCustomizationFolder, isCustomizationScope } from "./customization-registry";

export class CustomizationValidationError extends Error {
  constructor(message: string) { super(message); this.name = "CustomizationValidationError"; }
}

function fail(message: string): never { throw new CustomizationValidationError(message); }

export function isPlainCustomizationObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function object(value: unknown, label: string) {
  if (!isPlainCustomizationObject(value)) fail(`${label} must be an object`);
  return value;
}

function keys(value: Record<string, unknown>, allowed: readonly string[], label: string) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) fail(`${label}.${key} cannot be customized`);
  }
}

function color(value: unknown, label: string): string {
  if (typeof value !== "string" || !/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) fail(`${label} must be a valid HEX color`);
  return value.toUpperCase();
}

function font(value: unknown, label: string): CustomizationFont {
  if (typeof value !== "string" || !(CUSTOMIZATION_FONTS as readonly string[]).includes(value)) fail(`${label} must use an approved font`);
  return value as CustomizationFont;
}

function integer(value: unknown, min: number, max: number, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) fail(`${label} must be an integer from ${min} to ${max}`);
  return value;
}

function weight(value: unknown, label: string): number {
  const result = integer(value, 100, 900, label);
  if (result % 100) fail(`${label} must be a multiple of 100`);
  return result;
}

export function validateCustomizationImage(value: unknown, label = "Image", expectedFolder?: string): { url: string; publicId?: string } {
  const input = object(value, label);
  keys(input, ["url", "publicId"], label);
  if (typeof input.url !== "string" || input.url.length > 2048) fail(`${label} requires a valid image URL`);
  const url = input.url.trim();
  if (!url || /[<>"'\\\s(){}\u0000-\u001f\u007f]/.test(url)) fail(`${label} URL contains unsafe characters`);
  if (url.startsWith("/") && !url.startsWith("//")) {
    if (url.split(/[?#]/)[0].split("/").some((segment) => segment === ".." || segment === ".")) fail(`${label} URL cannot contain path traversal`);
  } else {
    let parsed: URL;
    try { parsed = new URL(url); } catch { fail(`${label} must use HTTPS or a local image path`); }
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) fail(`${label} must use HTTPS or a local image path`);
  }
  const result: { url: string; publicId?: string } = { url };
  if (input.publicId !== undefined && input.publicId !== null && input.publicId !== "") {
    if (typeof input.publicId !== "string" || input.publicId.length > 512) fail("Image publicId is invalid");
    const publicId = input.publicId.trim();
    if (!publicId || !/^[a-zA-Z0-9_/-]+$/.test(publicId) || publicId.split("/").some((part) => !part || part === "." || part === "..")) fail("Image publicId is invalid");
    const folder = expectedFolder ?? "salon-management/customization";
    const isAllowedFolder =
      publicId.startsWith(`${folder}/`) ||
      publicId.startsWith("salon-management/customization/") ||
      (folder.includes("wedding-beauty") && publicId.startsWith("salon-management/customization/public/home/weddingBeauty/")) ||
      !publicId.includes("/");
    if (!isAllowedFolder) fail("Image must belong to this customization upload folder");
    if (!url.startsWith("https://res.cloudinary.com/")) fail("Cloudinary publicId requires a Cloudinary image URL");
    result.publicId = publicId;
  }
  return result;
}

export function validateBackgroundImage(value: unknown, expectedFolder?: string, isHeroOrCta?: boolean): BackgroundImageStyle {
  const input = object(value, "Background image");
  keys(input, ["url", "publicId", "position", "mobilePosition", "size", "overlayDarkness", "overlayColor"], "Background image");
  const result: BackgroundImageStyle = {};
  if (input.url !== undefined && input.url !== "") {
    const img = validateCustomizationImage({ url: input.url, publicId: input.publicId }, "Background image", expectedFolder);
    result.url = img.url;
    if (img.publicId) result.publicId = img.publicId;
  }
  if (input.position !== undefined) {
    if (input.position !== "left" && input.position !== "center" && input.position !== "right") {
      fail("Background image position must be left, center or right");
    }
    result.position = input.position;
  }
  if (input.mobilePosition !== undefined) {
    if (input.mobilePosition !== "left" && input.mobilePosition !== "center" && input.mobilePosition !== "right") {
      fail("Background image mobile position must be left, center or right");
    }
    result.mobilePosition = input.mobilePosition;
  }
  if (input.size !== undefined) {
    if (input.size !== "cover" && input.size !== "contain") {
      fail("Background image size must be cover or contain");
    }
    result.size = input.size;
  }
  if (input.overlayDarkness !== undefined) {
    if (!isHeroOrCta) fail("Overlay darkness is only available on Hero and CTA sections");
    const val = integer(input.overlayDarkness, 0, 80, "Background image overlay darkness");
    if (val % 10 !== 0) fail("Background image overlay darkness must be a multiple of 10 (0% to 80%)");
    result.overlayDarkness = val;
  }
  if (input.overlayColor !== undefined && input.overlayColor !== "") {
    if (!isHeroOrCta) fail("Overlay color is only available on Hero and CTA sections");
    result.overlayColor = color(input.overlayColor, "Background image overlay color");
  }
  return result;
}

function textStyle(value: unknown, label: string, kind: "heading" | "description" | "highlightedText" | "button") {
  const input = object(value, label);
  const allowed = kind === "heading" ? ["fontFamily", "fontSizeDesktop", "fontSizeTablet", "fontSizeMobile", "fontWeight", "color"]
    : kind === "description" ? ["fontFamily", "fontSize", "color"]
    : kind === "highlightedText" ? ["color"]
    : ["backgroundColor", "textColor", "fontFamily", "fontSize", "fontWeight", "size", "borderRadius", "borderColor"];
  keys(input, allowed, label);
  const result: Record<string, string | number> = {};
  for (const [key, raw] of Object.entries(input)) {
    const field = `${label}.${key}`;
    if (["color", "backgroundColor", "textColor", "borderColor"].includes(key)) result[key] = color(raw, field);
    else if (key === "fontFamily") result[key] = font(raw, field);
    else if (key === "fontWeight") result[key] = weight(raw, field);
    else if (key === "fontSizeDesktop" || key === "fontSizeTablet") result[key] = integer(raw, 16, 96, field);
    else if (key === "fontSizeMobile") result[key] = integer(raw, 16, 64, field);
    else if (key === "fontSize") result[key] = integer(raw, 12, kind === "button" ? 24 : 32, field);
    else if (key === "borderRadius") result[key] = integer(raw, 0, 64, field);
    else if (key === "size") {
      if (raw !== "small" && raw !== "medium" && raw !== "large") fail(`${field} must be small, medium or large`);
      result[key] = raw;
    }
  }
  return result;
}

const colorFields = ["backgroundColor", "textColor", "headingColor", "activeLinkColor", "hoverColor", "linkColor", "accentColor", "iconColor", "activeItemBackground", "activeItemTextColor", "activeItemIconColor", "hoverBackground"];
const contentLimits: Record<ContentField, number> = { eyebrow: 120, heading: 240, highlightedText: 240, subheading: 400, description: 2000, primaryButtonText: 80, secondaryButtonText: 80 };

/** Reject unknown fields instead of silently accepting structural or CSS changes. */
export function validateSectionOverride(value: unknown, registration: SectionRegistration, expectedFolder?: string): SectionOverride {
  const input = object(value, "Customization");
  keys(input, ["content", "style", "media"], "Customization");
  const result: SectionOverride = {};
  if (input.content !== undefined && input.content !== null) {
    const source = object(input.content, "Content");
    keys(source, Object.keys(registration.content ?? {}), "Content");
    const content: Partial<Record<ContentField, string>> = {};
    for (const [rawKey, raw] of Object.entries(source)) {
      const key = rawKey as ContentField;
      if (typeof raw !== "string" || raw.length > contentLimits[key] || /[<>\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(raw)) fail(`Content.${key} must be plain text of at most ${contentLimits[key]} characters`);
      const trimmed = raw.trim();
      if (trimmed !== registration.content?.[key]) content[key] = trimmed;
    }
    if (Object.keys(content).length) result.content = content;
  }
  if (input.style !== undefined && input.style !== null) {
    const source = object(input.style, "Style");
    keys(source, registration.styles, "Style");
    const style: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(source)) {
      if (colorFields.includes(key)) style[key] = color(raw, `Style.${key}`);
      else if (key === "headingFont" || key === "bodyFont") style[key] = font(raw, `Style.${key}`);
      else if (key === "backgroundImage") style[key] = validateBackgroundImage(raw, expectedFolder, registration.isHeroOrCta);
      else if (key === "alignment") {
        if (raw !== "left" && raw !== "center" && raw !== "right") fail("Alignment must be left, center or right");
        style[key] = raw;
      } else if (key === "heading" || key === "sectionHeading" || key === "description" || key === "highlightedText" || key === "primaryButton" || key === "secondaryButton") {
        const kind = key === "sectionHeading" ? "heading" : key === "primaryButton" || key === "secondaryButton" ? "button" : key;
        const nested = textStyle(raw, `Style.${key}`, kind);
        if (Object.keys(nested).length) style[key] = nested;
      } else fail(`Style.${key} cannot be customized`);
    }
    if (Object.keys(style).length) result.style = style as SectionStyle;
  }
  if (input.media !== undefined && input.media !== null) {
    const source = object(input.media, "Media");
    keys(source, registration.media ?? [], "Media");
    const media: SectionMedia = {};
    for (const [key, raw] of Object.entries(source)) {
      if (key === "sectionImage") {
        media[key] = validateCustomizationImage(raw, "Section image", expectedFolder);
      } else fail(`Media.${key} cannot be customized`);
    }
    if (Object.keys(media).length) result.media = media;
  }
  return result;
}

export function validateGlobalOverride(group: string, value: unknown): SectionOverride {
  const registration = getGlobalRegistration(group);
  if (!registration) fail("Unknown global customization group");
  return validateSectionOverride(value, registration, "salon-management/customization/global");
}

export function validatePageSectionOverride(scope: string, pageKey: string, sectionKey: string, value: unknown): SectionOverride {
  if (!isCustomizationScope(scope)) fail("Unknown customization scope");
  const registration = getSectionRegistration(scope, pageKey, sectionKey);
  if (!registration) fail("Unknown customization section");
  return validateSectionOverride(value, registration, getCustomizationFolder(scope, pageKey, sectionKey));
}

export function isEmptyCustomization(override: SectionOverride): boolean {
  return !Object.keys(override.content ?? {}).length && !Object.keys(override.style ?? {}).length && !Object.keys(override.media ?? {}).length;
}
