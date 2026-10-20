import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SalonSettings from "@/models/SalonSettings";
import Branch, { IBranch } from "@/models/Branch";
import { getGooglePlacesConfig } from "@/lib/integrations/config";

export interface NormalizedGoogleReview {
  authorName: string;
  authorPhoto: string;
  rating: number;
  text: string;
  relativeTime: string;
  googleMapsUrl?: string;
}

export type GoogleReviewStatus =
  | "ready"
  | "empty"
  | "disabled"
  | "not_configured"
  | "provider_error";

export interface GoogleReviewsResponse {
  success: boolean;
  status: GoogleReviewStatus;
  enabled: boolean;
  configured?: boolean;
  rating: number | null;
  totalReviews: number;
  reviewCount: number;
  reviews: NormalizedGoogleReview[];
  businessUrl: string;
  writeReviewUrl?: string | null;
  branch?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  message?: string;
}

interface RawGoogleReview {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
  author_url?: string;
}

interface GooglePlacesApiResponse {
  status: string;
  error_message?: string;
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    url?: string;
    reviews?: RawGoogleReview[];
  };
}

// GET /api/google-reviews - Public Google reviews endpoint with branch isolation & global fallback
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const branchParam = searchParams.get("branch");

    // ==============================================================
    // BRANCH EXPLICITLY REQUESTED
    // When a branch is specified, ONLY use that branch's configuration.
    // NEVER fall back to another branch or global SalonSettings reviews.
    // ==============================================================
    if (branchParam !== null && branchParam.trim() !== "") {
      const trimmedParam = branchParam.trim();
      let branchDoc: IBranch | null = null;

      if (mongoose.Types.ObjectId.isValid(trimmedParam)) {
        branchDoc = await Branch.findById(trimmedParam).lean();
      }
      if (!branchDoc) {
        branchDoc = await Branch.findOne({ slug: trimmedParam.toLowerCase() }).lean();
      }

      // Branch does not exist or is inactive
      if (!branchDoc || branchDoc.isActive === false) {
        return NextResponse.json<GoogleReviewsResponse>({
          success: false,
          status: "not_configured",
          enabled: false,
          configured: false,
          rating: null,
          totalReviews: 0,
          reviewCount: 0,
          reviews: [],
          businessUrl: "",
          writeReviewUrl: null,
          branch: branchDoc
            ? {
                _id: branchDoc._id.toString(),
                name: branchDoc.name,
                slug: branchDoc.slug,
              }
            : null,
          message: branchDoc
            ? `Google Reviews are not currently available for ${branchDoc.name}.`
            : "Branch not found",
        });
      }

      const branchInfo = {
        _id: branchDoc._id.toString(),
        name: branchDoc.name,
        slug: branchDoc.slug,
      };

      const branchWriteReviewUrl = branchDoc.googleReviewUrl?.trim() || null;
      const branchBusinessUrl =
        branchDoc.googleReviewUrl?.trim() || branchDoc.googleMapsUrl?.trim() || "";

      // Branch has reviews disabled
      if (!branchDoc.reviewsEnabled) {
        return NextResponse.json<GoogleReviewsResponse>({
          success: true,
          status: "disabled",
          enabled: false,
          configured: Boolean(branchDoc.googlePlaceId?.trim()),
          rating: null,
          totalReviews: 0,
          reviewCount: 0,
          reviews: [],
          businessUrl: branchBusinessUrl,
          writeReviewUrl: branchWriteReviewUrl,
          branch: branchInfo,
          message: `Google reviews are currently disabled for ${branchDoc.name}.`,
        });
      }

      // Branch has reviews enabled but missing Google Place ID
      if (!branchDoc.googlePlaceId?.trim()) {
        return NextResponse.json<GoogleReviewsResponse>({
          success: true,
          status: "not_configured",
          enabled: true,
          configured: false,
          rating: null,
          totalReviews: 0,
          reviewCount: 0,
          reviews: [],
          businessUrl: branchBusinessUrl,
          writeReviewUrl: branchWriteReviewUrl,
          branch: branchInfo,
          message: `Google Reviews are not configured for ${branchDoc.name}.`,
        });
      }

      // Branch has reviews enabled and Google Place ID configured
      const placeId = branchDoc.googlePlaceId.trim();

      // Resolve Google Places API key using shared resolver
      // Priority: Admin Override (IntegrationSettings) -> Environment Variable -> None
      const googleConfig = await getGooglePlacesConfig();
      const apiKey = googleConfig.apiKey;

      if (!googleConfig.isConfigured || !apiKey) {
        return NextResponse.json<GoogleReviewsResponse>({
          success: false,
          status: "provider_error",
          enabled: true,
          configured: false,
          rating: null,
          totalReviews: 0,
          reviewCount: 0,
          reviews: [],
          businessUrl: branchBusinessUrl,
          writeReviewUrl: branchWriteReviewUrl,
          branch: branchInfo,
          message: "Google Reviews service is not configured.",
        });
      }

      const googleEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(
        apiKey.trim()
      )}`;

      const googleRes = await fetch(googleEndpoint, {
        next: { revalidate: 3600 },
      });

      if (!googleRes.ok) {
        console.error("Google Places API HTTP error:", googleRes.status, googleRes.statusText);
        return NextResponse.json<GoogleReviewsResponse>({
          success: false,
          status: "provider_error",
          enabled: true,
          configured: true,
          rating: null,
          totalReviews: 0,
          reviewCount: 0,
          reviews: [],
          businessUrl: branchBusinessUrl,
          writeReviewUrl: branchWriteReviewUrl,
          branch: branchInfo,
          message: "Reviews are temporarily unavailable. Please try again later.",
        });
      }

      const data: GooglePlacesApiResponse = await googleRes.json();

      if (data.status !== "OK" || !data.result) {
        console.error(
          "Google Places API responded with non-OK status:",
          data.status,
          data.error_message || ""
        );
        return NextResponse.json<GoogleReviewsResponse>({
          success: false,
          status: "provider_error",
          enabled: true,
          configured: true,
          rating: null,
          totalReviews: 0,
          reviewCount: 0,
          reviews: [],
          businessUrl: branchBusinessUrl,
          writeReviewUrl: branchWriteReviewUrl,
          branch: branchInfo,
          message: "Reviews are temporarily unavailable. Please try again later.",
        });
      }

      const result = data.result;
      const rating = typeof result.rating === "number" ? result.rating : null;
      const totalReviews =
        typeof result.user_ratings_total === "number" ? result.user_ratings_total : 0;
      const resolvedBusinessUrl =
        branchBusinessUrl ||
        result.url ||
        `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(
          placeId
        )}`;

      const rawReviews = Array.isArray(result.reviews) ? result.reviews : [];
      const normalizedReviews: NormalizedGoogleReview[] = rawReviews
        .slice(0, 5)
        .map((r) => ({
          authorName: r.author_name || "Google Reviewer",
          authorPhoto: r.profile_photo_url || "",
          rating: typeof r.rating === "number" ? r.rating : 5,
          text: r.text || "",
          relativeTime: r.relative_time_description || "",
          googleMapsUrl: r.author_url || "",
        }));

      const finalStatus: GoogleReviewStatus =
        normalizedReviews.length > 0 ? "ready" : "empty";

      return NextResponse.json<GoogleReviewsResponse>({
        success: true,
        status: finalStatus,
        enabled: true,
        configured: true,
        rating,
        totalReviews,
        reviewCount: totalReviews,
        reviews: normalizedReviews,
        businessUrl: resolvedBusinessUrl,
        writeReviewUrl: branchWriteReviewUrl,
        branch: branchInfo,
        message:
          finalStatus === "empty"
            ? `No Google reviews are currently available for ${branchDoc.name}.`
            : undefined,
      });
    }

    // ==============================================================
    // NO BRANCH PARAMETER PROVIDED -> PREFER ACTIVE MAIN BRANCH
    // Falls back to first active branch, then legacy settings if no branch exists.
    // ==============================================================
    let defaultBranch = await Branch.findOne({ isActive: true, isMain: true }).lean();
    if (!defaultBranch) {
      defaultBranch = await Branch.findOne({ isActive: true })
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean();
    }

    let placeId = "";
    let businessUrl = "";
    let reviewsEnabled = false;
    let branchInfo: { _id: string; name: string; slug: string } | null = null;
    let branchName = "Salon Zage";

    if (defaultBranch) {
      branchName = defaultBranch.name;
      reviewsEnabled = Boolean(defaultBranch.reviewsEnabled);
      placeId = (defaultBranch.googlePlaceId || "").trim();
      businessUrl = (defaultBranch.googleReviewUrl || defaultBranch.googleMapsUrl || "").trim();
      branchInfo = {
        _id: defaultBranch._id.toString(),
        name: defaultBranch.name,
        slug: defaultBranch.slug,
      };
    } else {
      const settings = await SalonSettings.findOne().lean();
      const globalGoogleSettings = settings?.googleReviews;
      reviewsEnabled = Boolean(globalGoogleSettings?.enabled);
      placeId = (globalGoogleSettings?.placeId || "").trim();
      businessUrl = (globalGoogleSettings?.businessUrl || "").trim();
    }

    if (!reviewsEnabled) {
      return NextResponse.json<GoogleReviewsResponse>({
        success: true,
        status: "disabled",
        enabled: false,
        configured: Boolean(placeId),
        rating: null,
        totalReviews: 0,
        reviewCount: 0,
        reviews: [],
        businessUrl,
        writeReviewUrl: businessUrl || null,
        branch: branchInfo,
        message: `Google reviews are currently disabled for ${branchName}.`,
      });
    }

    if (!placeId) {
      return NextResponse.json<GoogleReviewsResponse>({
        success: true,
        status: "not_configured",
        enabled: true,
        configured: false,
        rating: null,
        totalReviews: 0,
        reviewCount: 0,
        reviews: [],
        businessUrl,
        writeReviewUrl: businessUrl || null,
        branch: branchInfo,
        message: `Google Reviews are not configured for ${branchName}.`,
      });
    }

    const writeReviewUrl = businessUrl || null;

    const googleConfig = await getGooglePlacesConfig();
    const apiKey = googleConfig.apiKey;
    if (!googleConfig.isConfigured || !apiKey) {
      return NextResponse.json<GoogleReviewsResponse>({
        success: false,
        status: "provider_error",
        enabled: true,
        configured: false,
        rating: null,
        totalReviews: 0,
        reviewCount: 0,
        reviews: [],
        businessUrl,
        writeReviewUrl,
        branch: branchInfo,
        message: "Google Reviews service is not configured.",
      });
    }

    const googleEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(
      apiKey.trim()
    )}`;

    const googleRes = await fetch(googleEndpoint, {
      next: { revalidate: 3600 },
    });

    if (!googleRes.ok) {
      console.error("Google Places API HTTP error:", googleRes.status, googleRes.statusText);
      return NextResponse.json<GoogleReviewsResponse>({
        success: false,
        status: "provider_error",
        enabled: true,
        configured: true,
        rating: null,
        totalReviews: 0,
        reviewCount: 0,
        reviews: [],
        businessUrl,
        writeReviewUrl,
        branch: branchInfo,
        message: "Reviews are temporarily unavailable. Please try again later.",
      });
    }

    const data: GooglePlacesApiResponse = await googleRes.json();

    if (data.status !== "OK" || !data.result) {
      console.error(
        "Google Places API responded with non-OK status:",
        data.status,
        data.error_message || ""
      );
      return NextResponse.json<GoogleReviewsResponse>({
        success: false,
        status: "provider_error",
        enabled: true,
        configured: true,
        rating: null,
        totalReviews: 0,
        reviewCount: 0,
        reviews: [],
        businessUrl,
        writeReviewUrl,
        branch: branchInfo,
        message: "Reviews are temporarily unavailable. Please try again later.",
      });
    }

    const result = data.result;
    const rating = typeof result.rating === "number" ? result.rating : null;
    const totalReviews =
      typeof result.user_ratings_total === "number" ? result.user_ratings_total : 0;
    const resolvedBusinessUrl =
      businessUrl ||
      result.url ||
      `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(
        placeId
      )}`;

    const maxReviews = 5;

    const rawReviews = Array.isArray(result.reviews) ? result.reviews : [];
    const normalizedReviews: NormalizedGoogleReview[] = rawReviews
      .slice(0, maxReviews)
      .map((r) => ({
        authorName: r.author_name || "Google Reviewer",
        authorPhoto: r.profile_photo_url || "",
        rating: typeof r.rating === "number" ? r.rating : 5,
        text: r.text || "",
        relativeTime: r.relative_time_description || "",
        googleMapsUrl: r.author_url || "",
      }));

    const finalStatus: GoogleReviewStatus =
      normalizedReviews.length > 0 ? "ready" : "empty";

    return NextResponse.json<GoogleReviewsResponse>({
      success: true,
      status: finalStatus,
      enabled: true,
      configured: true,
      rating,
      totalReviews,
      reviewCount: totalReviews,
      reviews: normalizedReviews,
      businessUrl: resolvedBusinessUrl,
      writeReviewUrl: writeReviewUrl || resolvedBusinessUrl || null,
      branch: branchInfo,
      message:
        finalStatus === "empty"
          ? `No Google reviews are currently available for ${branchName}.`
          : undefined,
    });
  } catch (error) {
    console.error("GET /api/google-reviews internal error:", error);
    return NextResponse.json<GoogleReviewsResponse>(
      {
        success: false,
        status: "provider_error",
        enabled: false,
        rating: null,
        totalReviews: 0,
        reviewCount: 0,
        reviews: [],
        businessUrl: "",
        writeReviewUrl: null,
        message: "Reviews are temporarily unavailable. Please try again later.",
      },
      { status: 200 }
    );
  }
}
