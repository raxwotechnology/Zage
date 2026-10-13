import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { customizationFontVariables } from "@/lib/customization-fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { BranchProvider } from "@/components/context/BranchContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressButton from "@/components/ui/ScrollProgressButton";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import JsonLd from "@/components/seo/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zage.lk";

export const viewport: Viewport = {
  themeColor: "#03BF62",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SALVORA Salon | Look Beautiful. Feel Confident.",
    template: "%s | SALVORA Salon",
  },
  description:
    "Experience premier beauty and hair care treatments in Sri Lanka. Expert styling, restorative hair therapies, skin care, and luxury bridal dressing at SALVORA.",
  keywords: [
    "SALVORA Salon",
    "zage.lk",
    "beauty salon Sri Lanka",
    "hair salon Colombo",
    "bridal dressing Sri Lanka",
    "hair treatments",
    "keratin treatment Colombo",
    "luxury hair salon",
    "facial treatments",
    "nail art and manicure",
    "salon appointment online",
    "best salon in Sri Lanka",
  ],
  authors: [{ name: "SALVORA Salon", url: siteUrl }],
  creator: "SALVORA",
  publisher: "SALVORA",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: siteUrl,
    siteName: "SALVORA Salon",
    title: "SALVORA Salon | Look Beautiful. Feel Confident.",
    description:
      "Premier beauty and hair care treatments in Sri Lanka. Expert styling, restorative therapies, and luxury bridal dressing.",
    images: [
      {
        url: "/images/hero-salon.jpg",
        width: 1200,
        height: 630,
        alt: "SALVORA Luxury Salon Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SALVORA Salon | Look Beautiful. Feel Confident.",
    description:
      "Premier beauty and hair care treatments in Sri Lanka. Expert styling, restorative therapies, and luxury bridal dressing.",
    images: ["/images/hero-salon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${customizationFontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd siteUrl={siteUrl} salonName="SALVORA Salon" />
        <BranchProvider>
          <PageViewTracker />
          {children}
          <FloatingWhatsApp />
          <ScrollProgressButton />
        </BranchProvider>
      </body>
    </html>
  );
}
