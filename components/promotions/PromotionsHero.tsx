"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

interface PromotionsHeroProps {
  salonName?: string;
}

export default function PromotionsHero({ salonName = "Salvora" }: PromotionsHeroProps) {
  const custom = useSectionCustomization("hero");

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] text-stone-900 py-16 sm:py-24 border-b border-stone-200/80" data-customization-section="hero">
      {/* Background Graphic / Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={custom.image("/images/promotions-hero.png")}
          alt={`${salonName} Salon Promotions & Special Offers`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right sm:object-right opacity-40 sm:opacity-50" data-customization-role="backgroundImage" unoptimized={Boolean(custom.style.backgroundImage?.url)}
        />
        {/* Controlled warm gradient overlay for crisp text readability while preserving the salon atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-[#FAF7F2]/40 sm:via-[#FAF7F2]/85 sm:to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#029E51]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
            <span data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>Our Offers</>}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Promotions Crafted <br className="hidden sm:inline" /></>}
            <span className="bg-gradient-to-r from-[#029E51] via-[#03BF62] to-[#029E51] bg-clip-text text-transparent" data-customization-role="highlight">{custom.has("highlightedText") ? custom.text("highlightedText", "") : <>
              For You
            </>}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Discover special beauty offers, seasonal savings, and exclusive {salonName} salon
            deals designed to help you enjoy more for less.
          </>}</p>

          {/* Breadcrumb */}
          <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="h-3 w-3 opacity-60" />
            <span className="text-[#029E51] font-semibold">Promotions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
