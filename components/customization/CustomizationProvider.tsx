"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildCustomizationCss } from "@/lib/customization-styles";
import type { ContentField, CustomizationScope, GlobalOverrides, PageOverrides } from "@/lib/customization-types";

interface CustomizationContextValue {
  scope: CustomizationScope;
  pageKey: string;
  global: GlobalOverrides;
  sections: PageOverrides;
}
const Context = createContext<CustomizationContextValue>({scope: "public", pageKey: "home", global: {}, sections: {}});

export function CustomizationProvider({ scope, pageKey = "home", global = {}, sections = {}, children }: Partial<CustomizationContextValue> & {scope: CustomizationScope; children: ReactNode}) {
  const value = useMemo(() => ({scope, pageKey, global, sections}), [scope, pageKey, global, sections]);
  const css = useMemo(() => buildCustomizationCss(scope, pageKey, global, sections), [scope, pageKey, global, sections]);
  return <Context.Provider value={value}>
    {css ? <style data-customization-styles={`${scope}-${pageKey}`}>{css}</style> : null}
    <div data-customization-scope={scope} data-customization-page={pageKey} style={{display: "contents"}}>{children}</div>
  </Context.Provider>;
}

export function useGlobalCustomization() { return useContext(Context).global; }
export function useSectionCustomization(sectionKey: string) {
  const { sections } = useContext(Context);
  let override = sections[sectionKey];
  if (!override) {
    if (sectionKey === "wedding-beauty") {
      override = sections["weddingBeauty"] || sections["weddingPreview"] || sections["wedding"];
    } else if (sectionKey === "weddingBeauty") {
      override = sections["wedding-beauty"] || sections["weddingPreview"] || sections["wedding"];
    }
  }
  return {
    content: override?.content || {},
    style: override?.style || {},
    media: override?.media || {},
    has: (field: ContentField) => typeof override?.content?.[field] === "string",
    text: (field: ContentField, fallback: string) => override?.content?.[field] ?? fallback,
    image: (fallback: string) => override?.style?.backgroundImage?.url ?? fallback,
    sectionImage: (fallback: string) => override?.media?.sectionImage?.url ?? fallback,
    bgSettings: override?.style?.backgroundImage,
  };
}

export function CustomizationText({sectionKey, field, children}: {sectionKey: string; field: ContentField; children: ReactNode}) {
  const custom = useSectionCustomization(sectionKey);
  return custom.has(field) ? <span style={{display: "contents"}}>{custom.text(field, "")}</span> : <>{children}</>;
}

export default CustomizationProvider;
