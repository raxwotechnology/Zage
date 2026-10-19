"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";


import React, { useState, useMemo } from "react";
import PromotionCard, { PublicPromotion } from "./PromotionCard";
import { FilterSearchButton, FilterSearchInput } from "@/components/ui/FilterSearch";
import { XIcon } from "@/components/ui/icons";
import {
  PROMOTION_TYPE_LABELS,
  PromotionType,
} from "@/lib/promotion-constants";

interface PromotionsGridSectionProps {
  initialPromotions: PublicPromotion[];
  whatsappNumber?: string;
  bookingUrl?: string;
  salonName?: string;
}

const PROMO_FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "service_offer", label: "Service Offers" },
  { id: "product_deal", label: "Product Deals" },
  { id: "wedding_offer", label: "Wedding Offers" },
  { id: "branch_offer", label: "Branch Offers" },
  { id: "limited_time", label: "Limited Time" },
];

export default function PromotionsGridSection({
  initialPromotions,
  whatsappNumber,
  bookingUrl,
  salonName,
}: PromotionsGridSectionProps) {
  const custom = useSectionCustomization("promotions-grid");

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPromotionSearchOpen, setIsPromotionSearchOpen] = useState(false);
  const [promotionSearchQuery, setPromotionSearchQuery] = useState("");

  const filteredPromotions = useMemo(() => {
    let result = initialPromotions;

    // 1. Category / promoType filter
    if (activeTab !== "all") {
      result = result.filter((p) => p.promoType === activeTab);
    }

    // 2. Search query filter
    if (promotionSearchQuery.trim()) {
      const q = promotionSearchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const typeLabel = (PROMOTION_TYPE_LABELS[p.promoType as PromotionType] || p.promoType || "").toLowerCase();
        const matchesTitle = (p.title || "").toLowerCase().includes(q);
        const matchesDesc = (p.description || "").toLowerCase().includes(q);
        const matchesType = (p.promoType || "").toLowerCase().includes(q) || typeLabel.includes(q);
        const matchesCta = (p.ctaCustomLabel || "").toLowerCase().includes(q);
        const matchesBadge = (p.badgeText || "").toLowerCase().includes(q);
        const matchesSubtitle = (p.subtitle || "").toLowerCase().includes(q);
        const matchesValidDays = (p.validDaysText || "").toLowerCase().includes(q);
        const matchesBranch = Array.isArray(p.branches) && p.branches.some((b) => (b.name || "").toLowerCase().includes(q));

        return (
          matchesTitle ||
          matchesDesc ||
          matchesType ||
          matchesCta ||
          matchesBadge ||
          matchesSubtitle ||
          matchesValidDays ||
          matchesBranch
        );
      });
    }

    return result;
  }, [initialPromotions, activeTab, promotionSearchQuery]);

  return (
    <section className="bg-[#FAF9FB] py-16 sm:py-20" data-customization-section="promotions-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matches Mockup) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#03BF62]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
            <span data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>Special Deals</>}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Current Promotions
          </>}</h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Explore our latest salon and beauty offers, including seasonal savings, exclusive packages
            and limited-time deals designed just for you.
          </>}</p>
        </div>

        {/* Filter Row: Category Tabs + Search Button */}
        <div className="mt-8 relative w-full flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-0">
          {/* Filter Pills with horizontal scroll on smaller viewports */}
          <div className="overflow-x-auto no-scrollbar max-w-full py-1">
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 flex-nowrap min-w-max px-1">
              {PROMO_FILTER_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#03BF62] text-white shadow-md shadow-emerald-950/20"
                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Button: Positioned on the Right Side of the Filter Row */}
          <div className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 shrink-0">
            <FilterSearchButton
              isOpen={isPromotionSearchOpen}
              onToggle={() => setIsPromotionSearchOpen((prev) => !prev)}
              hasQuery={Boolean(promotionSearchQuery.trim())}
              ariaLabel="Search promotions"
            />
          </div>
        </div>

        {/* Slide-down Search Bar: Directly Below Filter Row */}
        <FilterSearchInput
          isOpen={isPromotionSearchOpen}
          query={promotionSearchQuery}
          onQueryChange={setPromotionSearchQuery}
          placeholder="Search promotions..."
          ariaLabel="Search promotions"
          containerClassName="w-full max-w-[700px] mx-auto mt-4 mb-2 animate-in fade-in slide-in-from-top-2 duration-200"
        />

        {/* Promotions Grid (3 Columns on Desktop matching Mockup) */}
        <div className="mt-10">
          {initialPromotions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-lg mx-auto">
              <p className="text-base font-semibold text-stone-800">
                There are no active promotions right now. Check back soon for new Salon Zage offers.
              </p>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-md mx-auto shadow-2xs">
              <p className="text-sm font-semibold text-stone-800">
                {promotionSearchQuery.trim()
                  ? "No promotions found for your search."
                  : "No active promotions in this category"}
              </p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {promotionSearchQuery.trim()
                  ? `We couldn't find any promotions matching "${promotionSearchQuery.trim()}". Try checking for spelling or adjusting your filters.`
                  : "New offers are launched frequently. Check our other special deals or view all promotions."}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {promotionSearchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setPromotionSearchQuery("")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 cursor-pointer"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                    <span>Clear Search</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setPromotionSearchQuery("");
                  }}
                  className="rounded-full bg-[#03BF62] px-5 py-2 text-xs font-semibold text-white hover:bg-[#029e51] shadow-xs cursor-pointer transition-colors"
                >
                  View All Promotions
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPromotions.map((promo) => (
                <PromotionCard
                  key={promo._id}
                  promotion={promo}
                  whatsappNumber={whatsappNumber}
                  bookingUrl={bookingUrl}
                  salonName={salonName}
                  showFeaturedBadge={true}
                  showBranches={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
