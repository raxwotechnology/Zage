"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, MapPinIcon, StarIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics-client";
import {
  RETAIL_CATEGORY_LABELS,
  RetailProductCategory,
  StockStatus,
} from "@/lib/retail-product-constants";
import { useBranchContext } from "@/components/context/BranchContext";
import { normalizeWhatsAppNumber } from "@/lib/phone";

export interface PublicProductBranch {
  _id: string;
  name: string;
  slug?: string;
}

export interface PublicRetailProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  brand?: string;
  image: string;
  description?: string;
  shortDescription?: string;
  cardShortSummary?: string;
  fullDescription?: string;
  price: number;
  salePrice?: number;
  stockStatus: StockStatus;
  size?: string;
  sku?: string;
  isFeatured?: boolean;
  isMostPopular?: boolean;
  isFastMoving?: boolean;
  isDiscountProduct?: boolean;
  audience?: "male" | "female" | "unisex";
  branchWhatsapp?: string;
  branches?: (PublicProductBranch | string)[];
}

interface ProductCardProps {
  product: PublicRetailProduct;
  whatsappNumber?: string;
  salonName?: string;
}

export default function ProductCard({
  product,
  whatsappNumber = "",
  salonName = "Salon Zage",
}: ProductCardProps) {
  const router = useRouter();
  const { selectedBranchWhatsapp } = useBranchContext();

  const isOutOfStock = product.stockStatus === "out_of_stock";
  const hasValidSalePrice =
    typeof product.salePrice === "number" &&
    product.salePrice >= 0 &&
    product.salePrice < product.price;

  const displayPrice = hasValidSalePrice ? (product.salePrice as number) : product.price;

  const discountPercent =
    hasValidSalePrice && product.price > 0
      ? Math.round(((product.price - (product.salePrice as number)) / product.price) * 100)
      : 0;

  const categoryLabel =
    RETAIL_CATEGORY_LABELS[product.category as RetailProductCategory] ||
    product.category?.replace(/_/g, " ") ||
    "Essentials";

  const summaryText =
    product.cardShortSummary?.trim() ||
    product.shortDescription?.trim() ||
    product.fullDescription?.trim() ||
    product.description?.trim() ||
    "";

  const getBranchDisplay = () => {
    if (!Array.isArray(product.branches) || product.branches.length === 0) {
      return null;
    }
    const validNames = product.branches
      .map((b) => (typeof b === "string" ? b : b?.name))
      .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
      .map((name) => name.trim());

    if (validNames.length === 0) return null;

    if (validNames.length <= 3) {
      return validNames.join(", ");
    }
    return `${validNames.slice(0, 2).join(", ")}, +${validNames.length - 2} more`;
  };

  const branchDisplayText = getBranchDisplay();

  const handleBuyClick = () => {
    trackEvent({
      eventType: "PRODUCT_CLICK",
      entityType: "RetailProduct",
      entityId: product._id,
      metadata: {
        label: product.name,
        category: product.category,
        source: "product-card",
      },
    });

    if (isOutOfStock) return;

    // Resolve WhatsApp number:
    // 1. selected/relevant branch.whatsappNumber
    // 2. active Main Branch.whatsappNumber
    // 3. first active branch.whatsappNumber
    // 4. if no WhatsApp number exists -> /contact
    const cleanPhone =
      normalizeWhatsAppNumber(selectedBranchWhatsapp) ||
      normalizeWhatsAppNumber(product.branchWhatsapp) ||
      normalizeWhatsAppNumber(whatsappNumber);

    if (!cleanPhone) {
      router.push("/contact");
      return;
    }

    const message = encodeURIComponent(
      `Hello ${salonName}! I am interested in purchasing "${product.name}" (LKR ${displayPrice.toLocaleString()}${
        product.sku ? `, SKU: ${product.sku}` : ""
      }). Could you please share availability and ordering details?`
    );

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const renderStockBadge = () => {
    switch (product.stockStatus) {
      case "in_stock":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            In Stock
          </span>
        );
      case "low_stock":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/70 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Low Stock
          </span>
        );
      case "out_of_stock":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200/70 px-2 py-0.5 text-[10px] font-medium text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-lg transition-all duration-200">
      <div className="space-y-2.5">
        {/* Product Image Frame */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Feature Badges - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {product.isMostPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                <StarIcon className="h-3 w-3 text-amber-400 fill-amber-400" />
                Most Popular
              </span>
            )}
            {product.isFastMoving && !product.isMostPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Fast Moving
              </span>
            )}
          </div>

          {/* Sale / Discount Badge - Top Right */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none">
            {hasValidSalePrice && !isOutOfStock && (
              <span className="rounded-full bg-[#03BF62] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs uppercase tracking-wider">
                {discountPercent > 0 ? `${discountPercent}% OFF` : "SALE"}
              </span>
            )}
            {!hasValidSalePrice && product.isDiscountProduct && !isOutOfStock && (
              <span className="rounded-full bg-[#03BF62] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs uppercase tracking-wider">
                Discount
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center z-20">
              <span className="rounded-full bg-stone-900/90 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Category & Stock Status Row */}
        <div className="pt-0.5 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#03BF62]">
            {categoryLabel}
          </span>
          {renderStockBadge()}
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#03BF62] transition-colors">
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && product.brand.trim().length > 0 && (
          <p className="text-xs font-medium text-stone-500">
            {product.brand.trim()}
          </p>
        )}

        {/* Card Short Summary */}
        {summaryText && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed min-h-[2rem]">
            {summaryText}
          </p>
        )}

        {/* Size / Volume */}
        {product.size && product.size.trim().length > 0 && (
          <p className="text-xs text-stone-500">
            <span className="text-stone-400 font-normal">Size: </span>
            <span className="font-semibold text-stone-700">{product.size.trim()}</span>
          </p>
        )}

        {/* Branch Availability */}
        {branchDisplayText && (
          <div className="flex items-start gap-1.5 text-[11px] text-stone-600">
            <MapPinIcon className="h-3.5 w-3.5 text-[#03BF62] shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-snug">
              <span className="text-stone-400 font-medium">Available at: </span>
              <span className="font-semibold text-stone-700">{branchDisplayText}</span>
            </p>
          </div>
        )}

        {/* Pricing Row */}
        <div className="pt-1 flex items-baseline gap-2">
          {hasValidSalePrice ? (
            <>
              <span className="text-sm sm:text-base font-extrabold text-stone-900">
                LKR {(product.salePrice as number).toLocaleString()}
              </span>
              <span className="text-xs text-stone-400 line-through">
                LKR {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-extrabold text-stone-900">
              LKR {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Buy Now / CTA Button */}
      <div className="mt-4 pt-1">
        <button
          type="button"
          onClick={handleBuyClick}
          disabled={isOutOfStock}
          className={`card-cta-btn group/btn w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isOutOfStock
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : "bg-[#ECEBEF] text-stone-800 hover:bg-[#03BF62] hover:text-white shadow-2xs active:scale-[0.98]"
          }`}
          aria-label={isOutOfStock ? `${product.name} is out of stock` : `Buy ${product.name}`}
        >
          <span>{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
          {!isOutOfStock && (
            <ArrowRightIcon className="card-cta-arrow h-3.5 w-3.5 text-[#03BF62] transition-colors group-hover/btn:text-[#FFFFFF]" />
          )}
        </button>
      </div>
    </div>
  );
}
