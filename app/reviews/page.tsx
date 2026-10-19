import { PageCustomization } from "@/components/customization/PageCustomization";
import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewsHero from "@/components/reviews/ReviewsHero";
import GoogleReviewsGrid from "@/components/reviews/GoogleReviewsGrid";
import TrustSection from "@/components/reviews/TrustSection";
import BookingCTA from "@/components/home/BookingCTA";
import { connectDB } from "@/lib/mongodb";
import SalonSettings from "@/models/SalonSettings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Reviews | Salon Zage",
  description:
    "Read real Google client reviews and feedback from guests who have experienced salon services at Salon Zage.",
};

async function getReviewsPageData(): Promise<{ bookingUrl: string; headerLogo: string; salonName: string }> {
  try {
    await connectDB();
    const settings = await SalonSettings.findOne().lean();
    return {
      bookingUrl: settings?.externalSystem?.bookingUrl || "",
      headerLogo: settings?.logo || "",
      salonName: settings?.salonName || "Salon Zage",
    };
  } catch (error) {
    console.error("Failed to load settings for Reviews page:", error);
    return { bookingUrl: "", headerLogo: "", salonName: "Salon Zage" };
  }
}

export default async function ReviewsPage() {
  const { bookingUrl, headerLogo, salonName } = await getReviewsPageData();

  return (
    <PageCustomization scope="public" pageKey="reviews">
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-[#03BF62]/30 selection:text-stone-900">
      {/* 1. Navbar */}
      <Navbar initialLogoUrl={headerLogo} initialSalonName={salonName} />

      <main className="flex-1">
        {/* 2. Reviews Hero */}
        <ReviewsHero />

        {/* 3. Google Rating Summary & 4. Google Reviews Grid */}
        <GoogleReviewsGrid />

        {/* 5. Trust / Customer Experience Section */}
        <TrustSection />

        {/* 6. Booking CTA */}
        <BookingCTA
          tag="✦ READY FOR YOUR VISIT"
          heading="Experience Salon Zage for Yourself"
          description="Choose your preferred service and continue to our salon booking system."
          bookingUrl={bookingUrl}
        />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
    </PageCustomization>
  );
}
