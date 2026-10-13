import React from "react";

interface JsonLdProps {
  siteUrl?: string;
  salonName?: string;
}

export default function JsonLd({
  siteUrl = "https://zage.lk",
  salonName = "SALVORA Salon",
}: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BeautySalon",
        "@id": `${siteUrl}/#salon`,
        name: salonName,
        url: siteUrl,
        logo: `${siteUrl}/images/salvora-logo-dark.png`,
        image: `${siteUrl}/images/hero-salon.jpg`,
        description:
          "Experience luxury hair care, beauty treatments, skincare, and bridal dressing at SALVORA Salon in Sri Lanka.",
        priceRange: "$$",
        telephone: "+94770000000",
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
          addressRegion: "Western Province",
          addressLocality: "Colombo",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "6.9271",
          longitude: "79.8612",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "09:00",
            closes: "17:00",
          },
        ],
        sameAs: [
          "https://www.facebook.com",
          "https://www.instagram.com",
          "https://www.tiktok.com",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: salonName,
        description: "Official Website for SALVORA Salon - Beauty, Hair, and Bridal Care",
        publisher: {
          "@id": `${siteUrl}/#salon`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
