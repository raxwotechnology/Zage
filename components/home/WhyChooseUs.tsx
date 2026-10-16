import { CustomizationText } from "@/components/customization/CustomizationProvider";
import React from "react";
import {
  ScissorsIcon,
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface WhyChooseUsProps {
  tag?: string;
  heading?: string;
  features?: FeatureItem[];
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: "Experienced Beauticians",
    description: "Skilled and passionate professionals committed to exceptional care.",
    icon: ScissorsIcon,
  },
  {
    title: "Quality Products",
    description: "High quality and trusted brands that nurture your hair and skin.",
    icon: SparklesIcon,
  },
  {
    title: "Personalized Care",
    description: "Treatments tailored to your distinct style, preferences, and needs.",
    icon: HeartIcon,
  },
  {
    title: "Relaxing Environment",
    description: "A calm and comfortable salon sanctuary designed for total rejuvenation.",
    icon: ShieldCheckIcon,
  },
];

export default function WhyChooseUs({
  tag = "✦ The Salon Zage Standard",
  heading = "Why Choose Salon Zage",
  features = DEFAULT_FEATURES,
}: WhyChooseUsProps = {}) {
  return (
    <section
      id="why-choose-salon-zage"
      className="bg-[#FAF8F5] py-16 sm:py-20 lg:py-24 border-t border-stone-200/60"
      data-customization-section="why-choose"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #why-choose-salon-zage .group:hover svg,
            #why-choose-salon-zage .group:hover svg *,
            #why-choose-salon-zage .why-choose-icon-box:hover svg,
            #why-choose-salon-zage .why-choose-icon-box:hover svg *,
            #why-choose-salon-zage svg:hover,
            #why-choose-salon-zage svg:hover * {
              color: #ffffff !important;
              stroke: #ffffff !important;
            }
          `,
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#03BF62]" data-customization-role="eyebrow">
            <CustomizationText sectionKey="why-choose" field="eyebrow">{tag}</CustomizationText>
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-stone-900" data-customization-role="heading">
            <CustomizationText sectionKey="why-choose" field="heading">{heading}</CustomizationText>
          </h2>
        </div>

        {/* 4 Prominent Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-7 sm:p-8 min-h-[220px] shadow-xs transition-all duration-300 hover:border-[#03BF62]/40 hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  {/* Large Icon Box with Enhanced Contrast */}
                  <div className="why-choose-icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03BF62]/10 text-[#03BF62] border border-[#03BF62]/20 shadow-2xs transition-all duration-300 group-hover:bg-[#03BF62] group-hover:!text-white group-hover:border-[#03BF62] hover:bg-[#03BF62] hover:!text-white hover:border-[#03BF62] group-hover:[&_svg]:!text-white group-hover:[&_svg]:!stroke-white hover:[&_svg]:!text-white hover:[&_svg]:!stroke-white mb-5">
                    <Icon className="h-7 w-7 transition-colors duration-300 group-hover:!text-white group-hover:!stroke-white hover:!text-white hover:!stroke-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#03BF62] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description with Higher Contrast */}
                  <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
