"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, StarIcon, SparklesIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics-client";

interface HeroSectionProps {
  bookingUrl?: string;
  serviceCount?: number;
  googleRating?: number | null;
}

export default function HeroSection({
  bookingUrl = "",
  serviceCount = 0,
  googleRating = null,
}: HeroSectionProps) {
  const custom = useSectionCustomization("hero");

  const hasRealStats = (serviceCount && serviceCount > 0) || (googleRating && googleRating > 0);

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] text-stone-900 py-16 sm:py-20 lg:py-24" data-customization-section="hero">
      {/* Background Salon Image - Soft Warm Blend */}
      <div className="absolute inset-0 z-0">
        <Image
          src={custom.image("/images/hero-salon.jpg")}
          alt="Salvora Salon professional styling and beauty care"
          fill
          priority
          className="object-cover object-right-top opacity-35 sm:opacity-45 lg:opacity-55"
          data-customization-role="backgroundImage"
          unoptimized={Boolean(custom.style.backgroundImage?.url)}
        />
        {/* Soft Warm Gradient Overlay: smooth text contrast on left, gentle salon view on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 lg:via-[#FAF7F2]/65 to-[#FAF7F2]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/95 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-6">
          {/* Label: Professional Beauty & Wellness */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#03BF62]/30 bg-[#03BF62]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#029e51]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62] animate-pulse" />
            <span data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>Professional Beauty & Wellness</>}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Beauty<br />
            Redefined<br /></>}
            <span className="text-[#029e51]" data-customization-role="highlight">{custom.has("highlightedText") ? custom.text("highlightedText", "") : <>For You</>}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Experience professional care, modern treatments and a relaxing salon
            environment at Salvora.
          </>}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {bookingUrl ? (
              <a
                href={bookingUrl}
                onClick={() => {
                  trackEvent({
                    eventType: "BOOKING_CLICK",
                    page: "/",
                    metadata: {
                      source: "home-hero",
                    },
                  });
                }}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#03BF62] px-8 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-[#029e51] hover:gap-3 transition-all duration-200 active:scale-[0.98]" data-customization-role="primaryButton"
              >
                <span data-customization-role="buttonText">{custom.has("primaryButtonText") ? custom.text("primaryButtonText", "") : <>Book Appointment</>}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Online booking link not yet configured"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#03BF62]/50 px-8 py-3.5 text-sm font-medium text-white/90 cursor-not-allowed shadow-none" data-customization-role="primaryButton"
              >
                <span data-customization-role="buttonText">{custom.has("primaryButtonText") ? custom.text("primaryButtonText", "") : <>Book Appointment</>}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}

            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/90 px-8 py-3.5 text-sm font-medium text-stone-800 shadow-xs transition-all hover:bg-stone-50 hover:border-stone-400 active:scale-[0.98]" data-customization-role="secondaryButton"
            >
              <span data-customization-role="buttonText">{custom.has("secondaryButtonText") ? custom.text("secondaryButtonText", "") : <>View Services</>}</span>
            </Link>
          </div>

          {/* Real Trust Information Only (No Fake Data) */}
          <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-6">
            {hasRealStats ? (
              <div className="flex items-center gap-8 sm:gap-10">
                {serviceCount > 0 && (
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                      {serviceCount}+
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">Beauty Services</p>
                  </div>
                )}

                {googleRating && googleRating > 0 && (
                  <>
                    <div className="h-8 w-px bg-stone-200" />
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-1">
                        <span>{googleRating.toFixed(1)}</span>
                        <StarIcon className="h-5 w-5 text-amber-500 fill-amber-500" />
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">Google Rating</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-xs text-stone-600">
                <SparklesIcon className="h-4 w-4 text-[#03BF62]" />
                <span>Personalized Consultations • Modern Salon Care</span>
              </div>
            )}

            {/* Subtle Scroll Down Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-stone-500 text-xs tracking-wider uppercase opacity-85">
              <div className="h-7 w-4 rounded-full border border-stone-400 p-0.5 flex justify-center">
                <div className="h-2 w-1 rounded-full bg-[#03BF62] animate-bounce" />
              </div>
              <span>Scroll Down</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
