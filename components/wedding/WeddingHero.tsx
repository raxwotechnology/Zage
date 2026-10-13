"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics-client";

interface WeddingHeroProps {
  bookingUrl?: string;
}

export default function WeddingHero({ bookingUrl = "" }: WeddingHeroProps) {
  const custom = useSectionCustomization("hero");

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] text-stone-900 py-16 sm:py-20 lg:py-24 border-b border-stone-200/80" data-customization-section="hero">
      {/* Background Bridal Styling Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={custom.image("/images/wedding-hero.jpg")}
          alt="Salvora Salon Bridal & Wedding Beauty Services"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right-top sm:object-center opacity-40 sm:opacity-50" data-customization-role="backgroundImage" unoptimized={Boolean(custom.style.backgroundImage?.url)}
        />
        {/* Controlled warm gradient overlay for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-[#FAF7F2]/40" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-4 text-left">
          {/* Label / Pill with Signature Dot */}
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#029E51]" data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>
              FOR YOUR MOST SPECIAL DAY
            </>}</span>
          </div>

          {/* Heading with Brand Gradient */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Wedding Beauty{" "}</>}
            <span className="block bg-gradient-to-r from-[#029E51] via-[#03BF62] to-[#029E51] bg-clip-text text-transparent" data-customization-role="highlight">{custom.has("highlightedText") ? custom.text("highlightedText", "") : <>
              Services
            </>}</span>
          </h1>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal max-w-xl" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Bridal makeup, hair styling, nail care, facials, and complete
            wedding packages designed to make you look and feel your best for
            your special day.
          </>}</p>

          {/* CTA Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {bookingUrl ? (
              <a
                href={bookingUrl}
                onClick={() => {
                  trackEvent({
                    eventType: "BOOKING_CLICK",
                    page: "/wedding",
                    metadata: {
                      source: "wedding-hero",
                    },
                  });
                }}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#03BF62] px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#029e51] hover:gap-3 transition-all duration-200 active:scale-[0.98]" data-customization-role="primaryButton"
              >
                <span data-customization-role="buttonText">{custom.has("primaryButtonText") ? custom.text("primaryButtonText", "") : <>Book Your Bridal Consultation</>}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Online booking link not yet configured"
                className="inline-flex items-center gap-2.5 rounded-full bg-stone-300 px-7 py-3 text-sm font-semibold text-stone-600 cursor-not-allowed" data-customization-role="primaryButton"
              >
                <span data-customization-role="buttonText">{custom.has("primaryButtonText") ? custom.text("primaryButtonText", "") : <>Book Your Bridal Consultation</>}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pt-2 flex items-center gap-2 text-xs font-medium">
            <Link
              href="/"
              className="text-stone-500 hover:text-stone-900 transition-colors"
            >
              Home
            </Link>
            <span className="text-stone-400">/</span>
            <span className="text-[#029E51] font-semibold">Wedding</span>
          </nav>
        </div>
      </div>
    </section>
  );
}
