"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";


import React, { useState, useMemo } from "react";
import ProductCard, { PublicRetailProduct } from "./ProductCard";
import { FilterSearchButton, FilterSearchInput } from "@/components/ui/FilterSearch";
import { XIcon } from "@/components/ui/icons";
import {
  RETAIL_CATEGORY_LABELS,
  RetailProductCategory,
} from "@/lib/retail-product-constants";

interface ProductsGridSectionProps {
  initialProducts: PublicRetailProduct[];
  whatsappNumber?: string;
  salonName?: string;
}

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "hair_care", label: "Hair Care" },
  { id: "skin_care", label: "Skin Care" },
  { id: "nail_care", label: "Nail Care" },
  { id: "styling", label: "Styling" },
  { id: "makeup", label: "Makeup" },
];

export default function ProductsGridSection({
  initialProducts,
  whatsappNumber,
  salonName,
}: ProductsGridSectionProps) {
  const custom = useSectionCustomization("products-grid");

  const [activeAudience, setActiveAudience] = useState<"all" | "female" | "male">("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // 1. Audience
      if (activeAudience !== "all") {
        const pAudience = p.audience || "unisex";
        if (pAudience !== activeAudience && pAudience !== "unisex") {
          return false;
        }
      }

      // 2. Category
      if (activeCategory !== "all" && p.category !== activeCategory) {
        return false;
      }

      // 3. Search Query
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.trim().toLowerCase();
        const categoryLabel = (
          RETAIL_CATEGORY_LABELS[p.category as RetailProductCategory] ||
          p.category ||
          ""
        ).toLowerCase();
        const matchesName = (p.name || "").toLowerCase().includes(q);
        const matchesBrand = (p.brand || "").toLowerCase().includes(q);
        const matchesCategory =
          (p.category || "").toLowerCase().includes(q) ||
          categoryLabel.includes(q);
        const matchesSummary = (
          p.cardShortSummary ||
          p.shortDescription ||
          ""
        )
          .toLowerCase()
          .includes(q);
        const matchesDesc = (
          p.fullDescription ||
          p.description ||
          ""
        )
          .toLowerCase()
          .includes(q);
        const matchesSize = (p.size || "").toLowerCase().includes(q);
        const matchesSku = (p.sku || "").toLowerCase().includes(q);

        if (
          !matchesName &&
          !matchesBrand &&
          !matchesCategory &&
          !matchesSummary &&
          !matchesDesc &&
          !matchesSize &&
          !matchesSku
        ) {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, activeAudience, activeCategory, productSearchQuery]);

  return (
    <section className="bg-[#FAF9FB] py-16 sm:py-20" data-customization-section="products-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matches Mockup) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#03BF62]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
            <span data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>Premium Collection</>}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
            Shop Beauty Essentials
          </>}</h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
            Discover our handpicked range of professional salon and beauty products. Trusted brands,
            salon-approved formulas, and everything you need for healthy, beautiful hair, skin and nails.
          </>}</p>
        </div>

        {/* Audience Filter Pills (SHOP FOR) + Search Button */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
            SHOP FOR
          </span>
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
            {/* Centered Gender Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { id: "all", label: "All" },
                { id: "female", label: "Women" },
                { id: "male", label: "Men" },
              ].map((tab) => {
                const isActive = activeAudience === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveAudience(tab.id as "all" | "female" | "male")}
                    className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Button: Positioned on the Right Side of the SHOP FOR Row */}
            <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 shrink-0">
              <FilterSearchButton
                isOpen={isProductSearchOpen}
                onToggle={() => setIsProductSearchOpen((prev) => !prev)}
                hasQuery={Boolean(productSearchQuery.trim())}
                ariaLabel="Search products"
              />
            </div>
          </div>
        </div>

        {/* Slide-down Search Bar: Directly Below SHOP FOR Row & Above CATEGORY Filters */}
        <FilterSearchInput
          isOpen={isProductSearchOpen}
          query={productSearchQuery}
          onQueryChange={setProductSearchQuery}
          placeholder="Search products..."
          ariaLabel="Search products"
          containerClassName="w-full max-w-[700px] mx-auto mt-4 mb-2 animate-in fade-in slide-in-from-top-2 duration-200"
        />

        {/* Category Filter Pills (CATEGORY) */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
            CATEGORY
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
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

        {/* Products Grid (5 Columns on Desktop matching Mockup) */}
        <div className="mt-10">
          {initialProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-md mx-auto">
              <p className="text-base font-semibold text-stone-800">No products are currently available.</p>
              <p className="text-xs text-stone-500 mt-1">
                Please check back soon for our curated beauty essentials.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-md mx-auto shadow-2xs">
              <p className="text-sm font-semibold text-stone-800">
                {productSearchQuery.trim()
                  ? "No products found for your search."
                  : "No products are currently available in this category."}
              </p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {productSearchQuery.trim()
                  ? `We couldn't find any products matching "${productSearchQuery.trim()}". Try checking for spelling or adjusting your filters.`
                  : "Please check back soon or browse our other salon collections."}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {productSearchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setProductSearchQuery("")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 cursor-pointer"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                    <span>Clear Search</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveAudience("all");
                    setActiveCategory("all");
                    setProductSearchQuery("");
                  }}
                  className="rounded-full bg-[#03BF62] px-5 py-2 text-xs font-semibold text-white hover:bg-[#029e51] shadow-xs cursor-pointer transition-colors"
                >
                  View All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                  salonName={salonName}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
