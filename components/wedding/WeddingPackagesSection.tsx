"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";
import React, { useState, useMemo } from "react";
import WeddingPackageCard, {
  WeddingPackageCardData,
} from "./WeddingPackageCard";
import { SearchIcon, XIcon } from "@/components/ui/icons";

interface WeddingPackagesSectionProps {
  packages: WeddingPackageCardData[];
  bookingUrl?: string;
}

export default function WeddingPackagesSection({
  packages,
  bookingUrl = "",
}: WeddingPackagesSectionProps) {
  const custom = useSectionCustomization("wedding-packages");
  const [selectedAudience, setSelectedAudience] = useState<"all" | "bride" | "groom">("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const audiencePackages = useMemo(() => {
    if (selectedAudience === "all") return packages;
    if (selectedAudience === "bride") {
      // Bride: bride + both
      return packages.filter(
        (p) => (p.audience ?? "both") === "bride" || (p.audience ?? "both") === "both"
      );
    }
    if (selectedAudience === "groom") {
      // Groom: groom + both
      return packages.filter(
        (p) => (p.audience ?? "both") === "groom" || (p.audience ?? "both") === "both"
      );
    }
    return packages;
  }, [packages, selectedAudience]);

  const filteredPackages = useMemo(() => {
    let result = audiencePackages;

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const itemMatch = (p.includedItems || []).some((item) =>
          item.toLowerCase().includes(q)
        );
        return nameMatch || descMatch || itemMatch;
      });
    }

    return result;
  }, [audiencePackages, searchQuery]);

  // If zero packages created by admin, hide cleanly as per requirements
  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAF9] border-b border-[#03BF62]/10" data-customization-section="wedding-packages">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#03BF62]" data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>
              SPECIAL OFFERS
            </>}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Wedding Packages
          </>}</h2>

          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Our carefully curated wedding packages offer a complete beauty
            experience for you and your loved ones.
          </>}</p>
        </div>

        {/* Top Filter Row: Gender/Audience Tabs (Centered) + Search Button (Right Side) */}
        <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-6 sm:mb-8">
          {/* Gender Selector: Visually Centered */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-2xs">
            {[
              { id: "all", label: "All" },
              { id: "bride", label: "Bride" },
              { id: "groom", label: "Groom" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedAudience(tab.id as "all" | "bride" | "groom")}
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
              aria-label="Search wedding packages"
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

        {/* Slide-down Search Bar: Directly Below Gender Row & Above Wedding Package Cards */}
        {isSearchOpen && (
          <div className="w-full max-w-[700px] mx-auto mb-8 sm:mb-10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4 h-4 w-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wedding packages..."
                aria-label="Search wedding packages"
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

        {/* Responsive Grid or Empty State */}
        {filteredPackages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-md mx-auto shadow-2xs">
            <p className="text-base font-semibold text-stone-800">
              {searchQuery.trim()
                ? "No wedding packages found for your search."
                : "No wedding packages are currently available for this selection."}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {searchQuery.trim()
                ? `We couldn't find any wedding packages matching "${searchQuery.trim()}". Try checking for spelling or adjusting your filters.`
                : "Please check back soon or choose another selection."}
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
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#03BF62] active:scale-[0.98] cursor-pointer"
              >
                <span>View All Packages</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredPackages.map((pkg, index) => (
              <WeddingPackageCard
                key={pkg._id}
                pkg={pkg}
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
