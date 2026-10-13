"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics-client";

interface BookingCTAProps {
  bookingUrl?: string;
  tag?: string;
  heading?: string;
  description?: string;
}

export default function BookingCTA({
  bookingUrl = "",
  tag = "BOOK AN APPOINTMENT",
  heading = "Ready to Look and Feel Your Best?",
  description = "Let our professional team bring out the best version of you.",
}: BookingCTAProps) {
  const custom = useSectionCustomization("booking-cta");

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] text-stone-900 py-20 sm:py-24 lg:py-28" data-customization-section="booking-cta">
      {/* Background Salon Image - Soft Warm Blend */}
      <div className="absolute inset-0 z-0">
        <Image
          src={custom.image("/images/cta-salon.jpg")}
          alt="Salvora Salon appointment styling"
          fill
          className="object-cover object-center opacity-25 sm:opacity-35"
          data-customization-role="backgroundImage"
          unoptimized={Boolean(custom.style.backgroundImage?.url)}
        />
        {/* Balanced warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-[#FAF7F2]/45" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-5 text-left">
          {/* Tag */}
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#029e51]" data-customization-role="eyebrow">
              {custom.text("eyebrow", tag)}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight" data-customization-role="heading">
            {custom.has("heading") ? custom.text("heading", "") : <>{heading}</>}
          </h2>

          {/* Description */}
          <p className="text-base text-stone-600 leading-relaxed font-normal" data-customization-role="description">
            {custom.has("description") ? custom.text("description", "") : <>{description}</>}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {bookingUrl ? (
              <a
                href={bookingUrl}
                onClick={() => {
                  trackEvent({
                    eventType: "BOOKING_CLICK",
                    page: "/",
                    metadata: {
                      source: "booking-cta",
                    },
                  });
                }}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#03BF62] px-9 py-4 text-sm font-medium text-white shadow-sm hover:bg-[#029e51] hover:gap-3 transition-all duration-200 active:scale-[0.98]" data-customization-role="primaryButton"
              >
                <span data-customization-role="buttonText">{custom.has("primaryButtonText") ? custom.text("primaryButtonText", "") : <>Book Appointment</>}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Online booking link not yet configured"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#03BF62]/50 px-9 py-4 text-sm font-medium text-white/90 cursor-not-allowed shadow-none" data-customization-role="primaryButton"
              >
                <span data-customization-role="buttonText">{custom.has("primaryButtonText") ? custom.text("primaryButtonText", "") : <>Book Appointment</>}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/90 px-8 py-4 text-sm font-medium text-stone-800 shadow-xs transition-all hover:bg-stone-50 hover:border-stone-400 active:scale-[0.98]" data-customization-role="secondaryButton"
            >
              <span data-customization-role="buttonText">{custom.has("secondaryButtonText") ? custom.text("secondaryButtonText", "") : <>Find a Branch</>}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
