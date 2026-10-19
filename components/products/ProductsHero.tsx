"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

interface ProductsHeroProps {
  salonName?: string;
}

export default function ProductsHero({ salonName = "Salon Zage" }: ProductsHeroProps) {
  const custom = useSectionCustomization("hero");

  return (
    <section className="relative overflow-hidden bg-[#0A0812] text-white py-14 sm:py-20 lg:py-24 border-b border-white/10" data-customization-section="hero">
      {/* Background Graphic / Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={custom.image("/images/products-hero.png")}
          alt={`${salonName} Professional Beauty & Salon Retail Products`}
          fill
          priority
          sizes="100vw"
          className={`${custom.bgSettings?.size === "contain" ? "object-contain" : "object-cover"} ${
            custom.bgSettings?.mobilePosition
              ? custom.bgSettings.mobilePosition === "left"
                ? "object-left"
                : custom.bgSettings.mobilePosition === "right"
                ? "object-right"
                : "object-center"
              : "object-[75%_center]"
          } ${
            custom.bgSettings?.position
              ? custom.bgSettings.position === "left"
                ? "sm:object-left"
                : custom.bgSettings.position === "right"
                ? "sm:object-right"
                : "sm:object-center"
              : "sm:object-right"
          } opacity-80 sm:opacity-90`}
          data-customization-role="backgroundImage"
          unoptimized={Boolean(custom.style.backgroundImage?.url)}
        />
        {/* Controlled gradient overlay for crisp text readability while showcasing the product atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0812] via-[#0A0812]/85 to-[#0A0812]/30 sm:via-[#0A0812]/75 sm:to-transparent" />
        <div
          data-customization-role="imageOverlay"
          className="absolute inset-0 pointer-events-none"
          style={custom.bgSettings?.overlayDarkness !== undefined ? { backgroundColor: custom.bgSettings.overlayColor || "#000000", opacity: custom.bgSettings.overlayDarkness / 100 } : { display: "none" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#03BF62]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
            <span data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>Our Products</>}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Products Chosen <br className="hidden sm:inline" /></>}
            <span className="bg-gradient-to-r from-[#03BF62] to-[#21C81E] bg-clip-text text-transparent" data-customization-role="highlight">{custom.has("highlightedText") ? custom.text("highlightedText", "") : <>
              For You
            </>}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Premium salon and beauty products, carefully selected by {salonName} experts to
            help you look and feel your best every day.
          </>}</p>

          {/* Breadcrumb */}
          <div className="pt-2 flex items-center gap-2 text-xs text-stone-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="h-3 w-3 opacity-60" />
            <span className="text-stone-200 font-semibold">Products</span>
          </div>
        </div>
      </div>
    </section>
  );
}
