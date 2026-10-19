"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ServiceCard, { ServiceCardData } from "@/components/ui/ServiceCard";
import { ScissorsIcon, ArrowRightIcon, SearchIcon, XIcon } from "@/components/ui/icons";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // If the selected category is no longer available for the current audience, fall back to "all"
  const activeCategory =
    selectedCategory !== "all" && !availableCategories.includes(selectedCategory)
      ? "all"
      : selectedCategory;

  // Final filtered list: audience + category + search query (respects displayOrder)
  const filteredServices = useMemo(() => {
    let result = audienceServices;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((s) => s.category?.trim() === activeCategory);
    }

    // Filter by search query (case-insensitive name, description, category)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((s) => {
        const nameMatch = s.name.toLowerCase().includes(q);
        const descMatch = (s.description || "").toLowerCase().includes(q);
        const catMatch = (s.category || "").toLowerCase().includes(q);
        return nameMatch || descMatch || catMatch;
      });
    }

    return result;
  }, [audienceServices, activeCategory, searchQuery]);

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
        {/* Top Filter Row: Gender/Audience Tabs (Centered) + Search Button (Right Side) */}
        {services.length > 0 && (
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-6 sm:mb-8">
            {/* Gender Selector: Visually Centered */}
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

            {/* Search Button: Positioned on the Right Side of the Gender Row */}
            <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Search services"
                aria-expanded={isSearchOpen}
                className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border bg-[#03BF62] text-white border-[#03BF62] hover:bg-[#029E51] shadow-xs active:scale-[0.98]"
              >
                <SearchIcon
                  data-icon-color="white"
                  style={{ color: "#FFFFFF" }}
                  className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white shrink-0"
                />
                <span>Search</span>
                {searchQuery.trim() && !isSearchOpen && (
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Slide-down Search Bar: Directly Below Gender Row & Above Category Filters */}
        {services.length > 0 && isSearchOpen && (
          <div className="w-full max-w-[700px] mx-auto mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4 h-4 w-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                aria-label="Search services"
                autoFocus
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 pl-11 pr-11 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-[#03BF62] focus:bg-white focus:ring-2 focus:ring-[#03BF62]/20 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-200/70 text-stone-500 hover:bg-stone-300 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Filters: One Single Line on Desktop, Horizontally Scrollable on Tablet/Mobile */}
        {services.length > 0 && availableCategories.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
              <div className="inline-flex items-center gap-2 xl:gap-2.5 flex-nowrap min-w-full justify-start lg:justify-center px-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3.5 sm:px-4 xl:px-4.5 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border whitespace-nowrap flex-shrink-0 ${
                    activeCategory === "all"
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
                    className={`px-3.5 sm:px-4 xl:px-4.5 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border whitespace-nowrap flex-shrink-0 ${
                      activeCategory === cat
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs font-bold"
                        : "bg-white text-stone-600 border-stone-200/90 hover:border-stone-300 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
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
              {searchQuery.trim() && selectedAudience === "all" && activeCategory === "all"
                ? "No services found for your search."
                : "No services are currently available for this selection."}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
              {searchQuery.trim()
                ? `We couldn't find any services matching "${searchQuery.trim()}". Try checking for spelling or adjusting your filters.`
                : "Try selecting another category or audience filter to browse our full range of salon treatments."}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 cursor-pointer"
                >
                  <XIcon className="h-3.5 w-3.5" />
                  <span>Clear Search</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedAudience("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#03BF62] active:scale-[0.98] cursor-pointer"
              >
                <span>View All Services</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
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
