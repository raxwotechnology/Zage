"use client";

import { useSectionCustomization } from "@/components/customization/CustomizationProvider";


import React, { useState } from "react";
import Image from "next/image";
import { PlusIcon, MinusIcon } from "@/components/ui/icons";

interface ContactFaqProps {
  address?: string;
}

export default function ContactFaq({ address = "" }: ContactFaqProps) {
  const custom = useSectionCustomization("quick-information");

  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const faqs = [
    {
      question: "Do I need to book an appointment?",
      answer:
        "We recommend booking in advance to ensure availability with your preferred beautician and treatment time. You can easily book online through our booking portal or contact us directly.",
    },
    {
      question: "What services do you offer?",
      answer:
        "Salon Zage provides a complete suite of salon treatments including hair cuts, styling, advanced hair spa treatments, coloring, facial therapies, and bridal beauty services.",
    },
    {
      question: "Where is the salon located?",
      answer: address?.trim()
        ? `Our salon is located at ${address}. You can find our exact pin location, interactive map, and Google Maps directions above.`
        : "Please reach out to our salon concierge team via phone or email for detailed location guidance.",
    },
    {
      question: "How can I contact Salon Zage?",
      answer:
        "You can reach out to our team by phone, email, WhatsApp, or through the message form on this page. We are always happy to answer your questions and assist with your visit.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="contact-faq-salon-zage"
      className="bg-white py-16 sm:py-20 lg:py-24 border-b border-stone-100"
      data-customization-section="quick-information"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #contact-faq-salon-zage [data-faq-open="true"],
            #contact-faq-salon-zage .faq-icon-box[data-icon-color="white"] {
              background-color: #03BF62 !important;
            }
            #contact-faq-salon-zage [data-faq-open="true"] svg,
            #contact-faq-salon-zage [data-faq-open="true"] svg *,
            #contact-faq-salon-zage .faq-icon-box[data-icon-color="white"] svg,
            #contact-faq-salon-zage .faq-icon-box[data-icon-color="white"] svg * {
              color: #ffffff !important;
              stroke: #ffffff !important;
            }
            #contact-faq-salon-zage button:hover .faq-icon-box,
            #contact-faq-salon-zage .faq-icon-box:hover,
            #contact-faq-salon-zage .group\\/faq:hover .faq-icon-box {
              background-color: #03BF62 !important;
            }
            #contact-faq-salon-zage button:hover .faq-icon-box svg,
            #contact-faq-salon-zage button:hover .faq-icon-box svg *,
            #contact-faq-salon-zage .faq-icon-box:hover svg,
            #contact-faq-salon-zage .faq-icon-box:hover svg *,
            #contact-faq-salon-zage .group\\/faq:hover .faq-icon-box svg,
            #contact-faq-salon-zage .group\\/faq:hover .faq-icon-box svg * {
              color: #ffffff !important;
              stroke: #ffffff !important;
            }
          `,
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Modern Salon Interior Image (Matches Mockup) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-stone-100 shadow-md group">
              <Image
                src="/images/contact-faq.jpg"
                alt="Salon Zage Styling Space and Interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#03BF62]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#03BF62]" data-customization-role="eyebrow">{custom.has("eyebrow") ? custom.text("eyebrow", "") : <>
                  FREQUENTLY ASKED
                </>}</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight" data-customization-role="heading">{custom.has("heading") ? custom.text("heading", "") : <>
                Quick Information
              </>}</h2>

              {/* Subtitle */}
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed" data-customization-role="description">{custom.has("description") ? custom.text("description", "") : <>
                Here are some common questions to help you get started. If you need
                further assistance, feel free to contact us.
              </>}</p>
            </div>

            {/* Accordion List */}
            <div className="space-y-3 pt-2">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-[#03BF62]/40 bg-[#03BF62]/5 shadow-xs"
                        : "border-stone-200/90 bg-white hover:border-[#03BF62]/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      className="group/faq w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover/faq:text-[#03BF62] transition-colors">
                        {faq.question}
                      </span>
                      <div
                        data-faq-open={isOpen ? "true" : "false"}
                        data-icon-color={isOpen ? "white" : undefined}
                        className={`faq-icon-box flex h-7 w-7 items-center justify-center rounded-full transition-all shrink-0 ${
                          isOpen
                            ? "bg-[#03BF62] text-white"
                            : "bg-[#03BF62]/10 text-[#03BF62] group-hover/faq:bg-[#03BF62] group-hover/faq:!text-white hover:bg-[#03BF62] hover:!text-white group-hover/faq:[&_svg]:!text-white group-hover/faq:[&_svg]:!stroke-white hover:[&_svg]:!text-white hover:[&_svg]:!stroke-white"
                        }`}
                      >
                        {isOpen ? (
                          <MinusIcon className="h-4 w-4 transition-colors duration-200 group-hover/faq:!text-white group-hover/faq:!stroke-white hover:!text-white hover:!stroke-white" data-icon-color="white" />
                        ) : (
                          <PlusIcon className="h-4 w-4 transition-colors duration-200 group-hover/faq:!text-white group-hover/faq:!stroke-white hover:!text-white hover:!stroke-white" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#03BF62]/15 mt-1">
                        <p className="pt-2">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
