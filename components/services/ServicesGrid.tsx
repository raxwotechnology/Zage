"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ServiceCard, { ServiceCardData } from "@/components/ui/ServiceCard";
import { ScissorsIcon, ArrowRightIcon } from "@/components/ui/icons";
import { DEFAULT_SERVICE_CATEGORIES } from "@/lib/service-constants";

interface ServicesGridProps {
  services: ServiceCardData[];
  bookingUrl?: string;
}

export default function ServicesGrid({
  services,
  bookingUrl = "",
}: ServicesGridProps) {
  const [selectedAudience, setSelectedAudience] = useState<"all" | "female" | "male">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const audienceServices = useMemo(() => {
    if (selectedAudience === "all") return services;
    if (selectedAudience === "female") {
      return services.filter(
        (s) => s.audience === "female" || s.audience === "unisex" || !s.audience
      );
    }
    if (selectedAudience === "male") {
      return services.filter(
        (s) => s.audience === "male" || s.audience === "unisex" || !s.audience
      );
    }
    return services;
  }, [services, selectedAudience]);

  // Compute available categories for the currently selected audience
  const availableCategories = useMemo(() => {
    const presentCategories = new Set<string>();
    audienceServices.forEach((s) => {
      if (s.category && s.category.trim() && s.category.trim() !== "Beard & Grooming") {
        presentCategories.add(s.category.trim());
      }
    });

    const ordered: string[] = [];
    DEFAULT_SERVICE_CATEGORIES.forEach((cat) => {
      if (presentCategories.has(cat)) {
        ordered.push(cat);
        presentCategories.delete(cat);
      }
    });

    const customCategories = Array.from(presentCategories).sort((a, b) => a.localeCompare(b));
    return [...ordered, ...customCategories];
  }, [audienceServices]);

  // Reset category filter if selected category is not available for new audience
  useEffect(() => {
    if (selectedCategory !== "all" && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [selectedCategory, availableCategories]);

  // Final filtered list: audience + category
  const filteredServices = useMemo(() => {
    if (selectedCategory === "all") {
      return audienceServices;
    }
    return audienceServices.filter((s) => s.category?.trim() === selectedCategory);
  }, [audienceServices, selectedCategory]);

  // Adaptive grid layout based on the number of real active services
  const getGridClass = (count: number) => {
    if (count === 1) return "max-w-md mx-auto";
    if (count === 2) return "max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8";
    if (count === 3) return "grid grid-cols-1 md:grid-cols-3 gap-8";
    if (count === 4) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8";
  };

  return (
    <section className="bg-white pb-20 sm:pb-24 lg:pb-28" data-customization-section="services-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Audience Selector Tabs */}
        {services.length > 0 && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-2xs">
              {[
                { id: "all", label: "All" },
                { id: "female", label: "Women" },
                { id: "male", label: "Men" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedAudience(tab.id as "all" | "female" | "male")}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedAudience === tab.id
                      ? "bg-white text-stone-900 shadow-xs border border-stone-200/60 font-bold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Pills (Directly Under Audience Tabs) */}
        {services.length > 0 && availableCategories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                selectedCategory === "all"
                  ? "bg-stone-900 text-white border-stone-900 shadow-xs font-bold"
                  : "bg-white text-stone-600 border-stone-200/90 hover:border-stone-300 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              All Services
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white border-stone-900 shadow-xs font-bold"
                    : "bg-white text-stone-600 border-stone-200/90 hover:border-stone-300 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-md mx-auto shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03BF62]/10 text-[#03BF62] mb-4">
              <ScissorsIcon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Services Updating Soon
            </h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Our services are currently being updated. Please check back soon or get in touch with us directly.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#03BF62] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#029e51] active:scale-[0.98]"
            >
              <span>Contact Salon Zage</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/50 p-12 text-center max-w-md mx-auto shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-4">
              <ScissorsIcon className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              No services are currently available for this selection.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
              Try selecting another category or audience filter to browse our full range of salon treatments.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedAudience("all");
                setSelectedCategory("all");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#03BF62] active:scale-[0.98] cursor-pointer"
            >
              <span>View All Services</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Adaptive Services Grid */
          <div className={getGridClass(filteredServices.length)}>
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                bookingUrl={bookingUrl}
                fallbackIndex={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
