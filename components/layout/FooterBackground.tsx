"use client";

import Image from "next/image";
import { useGlobalCustomization } from "@/components/customization/CustomizationProvider";

export default function FooterBackground() {
  const global = useGlobalCustomization();
  const bgSettings = global.publicFooter?.style?.backgroundImage;
  const customImageUrl = bgSettings?.url;
  if (!customImageUrl) return null;

  return (
    <Image
      src={customImageUrl}
      alt="Footer background decoration"
      fill
      sizes="100vw"
      className={`${bgSettings.size === "contain" ? "object-contain" : "object-cover"} ${
        bgSettings.mobilePosition
          ? bgSettings.mobilePosition === "left"
            ? "object-left"
            : bgSettings.mobilePosition === "right"
            ? "object-right"
            : "object-center"
          : "object-center"
      } ${
        bgSettings.position
          ? bgSettings.position === "left"
            ? "sm:object-left"
            : bgSettings.position === "right"
            ? "sm:object-right"
            : "sm:object-center"
          : "sm:object-left-bottom"
      } opacity-75`}
      data-customization-role="backgroundImage"
      unoptimized
    />
  );
}
