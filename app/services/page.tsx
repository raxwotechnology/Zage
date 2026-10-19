import { PageCustomization } from "@/components/customization/PageCustomization";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesIntro from "@/components/services/ServicesIntro";
import ServicesGrid from "@/components/services/ServicesGrid";
import WhyChooseUs, { FeatureItem } from "@/components/home/WhyChooseUs";
import BookingCTA from "@/components/home/BookingCTA";
import {
  ScissorsIcon,
  HeartIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import SalonSettings from "@/models/SalonSettings";
import { ServiceCardData } from "@/components/ui/ServiceCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Services | Salon Zage",
  description:
    "Explore professional salon treatments created to help you look and feel your best at Salon Zage.",
};

async function getServices(): Promise<ServiceCardData[]> {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return services
      .map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        description: s.description || "",
        price: s.price || 0,
        duration: s.duration || 0,
        image: s.image || "",
        audience: s.audience || "unisex",
        displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : 0,
        category: s.category ? s.category.trim() : null,
        createdAt: s.createdAt,
      }))
      .sort((a, b) => {
        const orderA = a.displayOrder ?? 0;
        const orderB = b.displayOrder ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      });
  } catch (error) {
    console.error("Failed to load services for public page:", error);
    return [];
  }
}

export default async function ServicesPage() {
  await connectDB();
  const [services, settings] = await Promise.all([
    getServices(),
    SalonSettings.findOne().lean(),
  ]);

  const bookingUrl = settings?.externalSystem?.bookingUrl || "";

  const serviceBenefits: FeatureItem[] = [
    {
      title: "Professional Beauticians",
      description:
        "Skilled and experienced professionals dedicated to your beauty and confidence.",
      icon: ScissorsIcon,
    },
    {
      title: "Personalized Treatments",
      description:
        "Treatments tailored to your unique hair, skin and beauty needs.",
      icon: HeartIcon,
    },
    {
      title: "Quality Products",
      description:
        "High quality and trusted products for skin and lasting results.",
      icon: SparklesIcon,
    },
    {
      title: "Comfortable Salon Experience",
      description:
        "A clean, modern and relaxing environment designed for your comfort.",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <PageCustomization scope="public" pageKey="services">
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-[#03BF62]/30 selection:text-stone-900">
      {/* 1. Navbar */}
      <Navbar initialLogoUrl={settings?.logo || ""} initialSalonName={settings?.salonName} />

      <main className="flex-1">
        {/* 2. Services Hero */}
        <ServicesHero />

        {/* 3. Services Introduction */}
        <ServicesIntro />

        {/* 4. Adaptive Services Grid */}
        <ServicesGrid services={services} bookingUrl={bookingUrl} />

        {/* 5. Why Choose Salon Zage / Service Benefits */}
        <WhyChooseUs
          tag="✦ WHY CHOOSE SALON ZAGE"
          heading="Why Choose Salon Zage?"
          features={serviceBenefits}
        />

        {/* 6. Booking CTA */}
        <BookingCTA
          bookingUrl={bookingUrl}
          tag="✦ READY TO BOOK"
          heading="Ready to Book Your Treatment?"
          description="Choose your preferred service and continue to our salon booking system."
        />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
    </PageCustomization>
  );
}