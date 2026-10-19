import type { PageRegistration } from "@/lib/customization-types";

// Presentation-only fields from the existing public page sections. Defaults are never persisted.
export const publicPages: PageRegistration[] = [
  {
    "key": "home",
    "label": "Home",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Hair, Beauty & Grooming",
          "highlightedText": "For You",
          "eyebrow": "Professional Beauty & Wellness",
          "description": "Experience professional care, modern treatments and a relaxing salon environment at Salon Zage.",
          "primaryButtonText": "Book Appointment",
          "secondaryButtonText": "View Services"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description",
          "primaryButton",
          "secondaryButton"
        ],
        "defaultImage": "/images/hero-salon.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "about-preview",
        "label": "About Preview",
        "content": {
          "heading": "Where Beauty Meets Confidence",
          "eyebrow": "✦ About Salon Zage",
          "description": "At Salon Zage, we believe beauty is more than a look — it's a feeling. Our professional team is dedicated to bringing out your natural beauty with personalized care and modern techniques.",
          "primaryButtonText": "Discover Our Story"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/about-salon.jpg"
      },
      {
        "key": "services-preview",
        "label": "Services Preview",
        "content": {
          "heading": "Treatments Designed Around You",
          "eyebrow": "✦ Our Services",
          "primaryButtonText": "View All Services"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "primaryButton"
        ]
      },
      {
        "key": "wedding-beauty",
        "label": "Wedding Beauty",
        "content": {
          "heading": "Wedding Beauty & Grooming",
          "eyebrow": "WEDDING SERVICES",
          "subheading": "Your special day deserves a look designed just for you.",
          "description": "Explore professional hair styling, makeup, grooming, nail care, and complete wedding packages for brides, grooms, and wedding parties.",
          "primaryButtonText": "Explore Wedding Services"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton",
          "sectionHeading"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/wedding-hero.jpg"
      },
      {
        "key": "wedding-packages",
        "label": "Wedding Packages",
        "content": {
          "heading": "Find Your Perfect Bridal Package",
          "eyebrow": "WEDDING PACKAGES",
          "description": "Explore selected Salon Zage wedding packages designed for your special day.",
          "primaryButtonText": "View All Wedding Packages"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ]
      },
      {
        "key": "products-preview",
        "label": "Products Preview",
        "content": {
          "heading": "Beauty Essentials For Your Routine",
          "eyebrow": "OUR PRODUCTS",
          "description": "Discover selected professional beauty products available from Salon Zage.",
          "primaryButtonText": "View All Products"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ]
      },
      {
        "key": "promotions-preview",
        "label": "Promotions Preview",
        "content": {
          "heading": "Latest Promotions",
          "eyebrow": "SPECIAL OFFERS",
          "description": "Explore current beauty offers, product deals and wedding specials from Salon Zage.",
          "primaryButtonText": "View All Promotions"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ]
      },
      {
        "key": "why-choose",
        "label": "Why Choose Salon Zage",
        "content": {
          "heading": "Why Choose Salon Zage",
          "eyebrow": "✦ The Salon Zage Standard"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading"
        ]
      },
      {
        "key": "beauticians",
        "label": "Beauticians",
        "content": {
          "heading": "Meet Our Beauty Experts",
          "eyebrow": "✦ Our Team",
          "primaryButtonText": "View Our Team"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "primaryButton"
        ]
      },
      {
        "key": "gallery",
        "label": "Gallery Preview",
        "content": {
          "heading": "Our Latest Looks",
          "eyebrow": "✦ Our Gallery",
          "primaryButtonText": "View Gallery"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "primaryButton"
        ]
      },
      {
        "key": "reviews",
        "label": "Reviews Preview",
        "content": {
          "heading": "What Our Clients Say",
          "eyebrow": "✦ Client Love",
          "primaryButtonText": "View on Google"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "primaryButton"
        ]
      },
      {
        "key": "booking-cta",
        "label": "Booking CTA",
        "content": {
          "heading": "Ready for Your Next Look?",
          "primaryButtonText": "Book Appointment",
          "eyebrow": "✦ Book Your Visit",
          "description": "Let our professional team bring out the best version of you."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "primaryButton",
          "description"
        ],
        "defaultImage": "/images/cta-salon.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "branches",
        "label": "Branches Preview",
        "content": {
          "heading": "Contact Us",
          "eyebrow": "VISIT SALON ZAGE",
          "description": "Find the Salon Zage branch nearest to you and get in touch with our team.",
          "primaryButtonText": "View All Branches"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ]
      }
    ]
  },
  {
    "key": "about",
    "label": "About",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "More Than a Salon",
          "highlightedText": "A Place for You",
          "subheading": "Care That Goes Beyond Beauty",
          "eyebrow": "ABOUT SALON ZAGE",
          "description": "A little time for yourself, with thoughtful treatments and personal attention in a calming space.",
          "primaryButtonText": "Explore Our Services"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "highlightedText",
          "description",
          "primaryButton",
          "sectionHeading"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/about-sunlit-salon.png"
      },
      {
        "key": "our-story",
        "label": "Our Story",
        "content": {
          "heading": "Where Beauty Meets Confidence",
          "eyebrow": "OUR STORY",
          "description": "At Salon Zage, we believe beauty is more than a look — it is a feeling. Our professional team is dedicated to bringing out your natural beauty with personalized care and modern techniques, in a clean and relaxing environment.",
          "primaryButtonText": "Discover Our Story"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/about-salon.jpg"
      },
      {
        "key": "our-values",
        "label": "Our Values",
        "content": {
          "heading": "What We Stand For",
          "eyebrow": "OUR VALUES"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading"
        ]
      },
      {
        "key": "salon-experience",
        "label": "Salon Experience",
        "content": {
          "heading": "A Modern Space Designed for You",
          "eyebrow": "OUR SALON",
          "description": "Our salon is designed to give you a comfortable and relaxing experience. With modern equipment, a clean environment, and a friendly team, Salon Zage is the perfect place to take time for yourself and feel your best.",
          "primaryButtonText": "Visit Our Salon"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/salon-experience.jpg"
      },
      {
        "key": "beauticians",
        "label": "Beauticians",
        "content": {
          "heading": "Meet Our Beauty Experts",
          "eyebrow": "OUR TEAM",
          "primaryButtonText": "View Our Services"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "primaryButton"
        ]
      },
      {
        "key": "product-brands",
        "label": "Product Brands",
        "content": {
          "heading": "Premium Brands for Exceptional Care",
          "eyebrow": "PRODUCTS WE USE",
          "description": "We only work with world-class, salon-grade product lines carefully selected to guarantee radiant, healthy, and long-lasting results."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "booking-cta",
        "label": "Booking CTA",
        "content": {
          "heading": "Let's Bring Out Your Best Look",
          "primaryButtonText": "Book Appointment",
          "eyebrow": "✦ READY FOR A CHANGE",
          "description": "Book your appointment and experience professional care at Salon Zage."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "primaryButton",
          "description"
        ],
        "defaultImage": "/images/cta-salon.jpg",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "services",
    "label": "Services",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Services Designed",
          "highlightedText": "Around You",
          "eyebrow": "OUR SERVICES",
          "description": "Explore professional salon treatments created to help you look and feel your best."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description"
        ],
        "defaultImage": "/images/services-hero.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "intro",
        "label": "Services Introduction",
        "content": {
          "heading": "Find the Right Treatment for You",
          "eyebrow": "WHAT WE OFFER",
          "description": "From hair care and styling to beauty treatments, our services are designed to bring out the best version of you with professional care and modern techniques."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "services-grid",
        "label": "Services Grid",
        "content": {},
        "styles": [
          "backgroundColor"
        ]
      },
      {
        "key": "why-choose",
        "label": "Why Choose Salon Zage",
        "content": {
          "heading": "Why Choose Salon Zage?",
          "eyebrow": "✦ WHY CHOOSE SALON ZAGE"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading"
        ]
      },
      {
        "key": "booking-cta",
        "label": "Booking CTA",
        "content": {
          "heading": "Ready to Book Your Treatment?",
          "primaryButtonText": "Book Appointment",
          "eyebrow": "✦ READY TO BOOK",
          "description": "Choose your preferred service and continue to our salon booking system."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "primaryButton",
          "description"
        ],
        "defaultImage": "/images/cta-salon.jpg",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "products",
    "label": "Products",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Products Chosen",
          "highlightedText": "For You",
          "eyebrow": "Our Products",
          "description": "Premium salon and beauty products, carefully selected by Salon Zage experts to help you look and feel your best every day."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description"
        ],
        "defaultImage": "/images/products-hero.png",
        "isHeroOrCta": true
      },
      {
        "key": "products-grid",
        "label": "Products Grid Heading",
        "content": {
          "heading": "Shop Beauty Essentials",
          "eyebrow": "Premium Collection",
          "description": "Discover our handpicked range of professional salon and beauty products. Trusted brands, salon-approved formulas, and everything you need for healthy, beautiful hair, skin and nails."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "why-buy",
        "label": "Why Buy From Salon Zage",
        "content": {
          "heading": "Why Buy From Salon Zage?",
          "eyebrow": "Why Choose Salon Zage"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading"
        ]
      },
      {
        "key": "bottom-cta",
        "label": "Bottom CTA",
        "content": {
          "heading": "Find the Right Product for",
          "highlightedText": "Your Routine",
          "eyebrow": "Beauty Essentials",
          "description": "Get personalized product recommendations from our professional Salon Zage team and discover what works best for you.",
          "primaryButtonText": "Enquire Now"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description",
          "primaryButton"
        ],
        "defaultImage": "/images/products-bottom-cta.png",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "promotions",
    "label": "Promotions",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Promotions Crafted",
          "highlightedText": "For You",
          "eyebrow": "Our Offers",
          "description": "Discover special beauty offers, seasonal savings, and exclusive Salon Zage salon deals designed to help you enjoy more for less."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description"
        ],
        "defaultImage": "/images/promotions-hero.png",
        "isHeroOrCta": true
      },
      {
        "key": "promotions-grid",
        "label": "Promotions Grid Heading",
        "content": {
          "heading": "Current Promotions",
          "eyebrow": "Special Deals",
          "description": "Explore our latest salon and beauty offers, including seasonal savings, exclusive packages and limited-time deals designed just for you."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "why-offers",
        "label": "Why Customers Love Our Offers",
        "content": {
          "heading": "Why Customers Love Our Offers",
          "eyebrow": "Why Choose Salon Zage"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading"
        ]
      },
      {
        "key": "bottom-cta",
        "label": "Bottom CTA",
        "content": {
          "heading": "Don't Miss Your Next",
          "highlightedText": "Beauty Deal",
          "eyebrow": "Limited Time",
          "description": "Book your preferred offer or contact our Salon Zage team to find the best promotion for your needs.",
          "primaryButtonText": "See All Offers"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description",
          "primaryButton"
        ],
        "defaultImage": "/images/promotions-bottom-cta.png",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "wedding",
    "label": "Wedding",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Wedding Beauty",
          "highlightedText": "Services",
          "eyebrow": "FOR YOUR MOST SPECIAL DAY",
          "description": "Bridal makeup, hair styling, nail care, facials, and complete wedding packages designed to make you look and feel your best for your special day.",
          "primaryButtonText": "Book Your Bridal Consultation"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description",
          "primaryButton"
        ],
        "defaultImage": "/images/wedding-hero.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "wedding-services",
        "label": "Wedding Services",
        "content": {
          "heading": "Single Wedding Services",
          "eyebrow": "OUR SERVICES",
          "description": "Choose from our range of individual wedding services, curated to help you look and feel your best."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "wedding-packages",
        "label": "Wedding Packages",
        "content": {
          "heading": "Wedding Packages",
          "eyebrow": "SPECIAL OFFERS",
          "description": "Our carefully curated wedding packages offer a complete beauty experience for you and your loved ones."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "why-wedding",
        "label": "Why Choose Our Wedding Services",
        "content": {
          "heading": "Why Choose Our Wedding Services",
          "eyebrow": "WHY CHOOSE US",
          "description": "We are committed to making your wedding day even more special with our expertise and personalized care."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "consultation-cta",
        "label": "Wedding Consultation CTA",
        "content": {
          "heading": "Book Your Wedding Beauty Consultation",
          "eyebrow": "LET'S PLAN YOUR PERFECT LOOK",
          "description": "Schedule a personalized consultation with our bridal experts and let us bring your dream look to life.",
          "primaryButtonText": "Book Consultation"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "description",
          "primaryButton"
        ],
        "defaultImage": "/images/wedding-consultation-cta.png",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "vendors",
    "label": "Vendors",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Trusted Vendors",
          "highlightedText": "For Your Special Moments",
          "eyebrow": "Our Vendors",
          "description": "Discover trusted professionals for weddings, celebrations and special events, selected to help make every moment unforgettable."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description"
        ],
        "defaultImage": "/images/vendors/vendors-hero.webp",
        "isHeroOrCta": true
      },
      {
        "key": "vendors-grid",
        "label": "Vendors Heading",
        "content": {
          "heading": "Featured Partners",
          "subheading": "All Trusted Service Providers",
          "eyebrow": "PREMIER HIGHLIGHTS"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "sectionHeading"
        ]
      },
      {
        "key": "bottom-cta",
        "label": "Bottom CTA",
        "content": {
          "heading": "Let’s Make Your Event",
          "highlightedText": "Truly Special",
          "eyebrow": "Plan Your Special Day",
          "description": "Connect with trusted Salon Zage vendors and start planning your wedding or special event with confidence.",
          "primaryButtonText": "Explore Vendors"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description",
          "primaryButton"
        ],
        "defaultImage": "/images/vendors/vendors-cta.webp",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "gallery",
    "label": "Gallery",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Moments of Beauty",
          "highlightedText": "Real Transformations",
          "eyebrow": "OUR GALLERY",
          "description": "Explore our gallery of real salon moments, treatments, styling and client transformations at Salon Zage."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description"
        ],
        "defaultImage": "/images/gallery-hero.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "gallery-heading",
        "label": "Gallery Heading",
        "content": {
          "heading": "A Glimpse Into Our Salon",
          "eyebrow": "OUR WORK",
          "description": "Discover moments from our salon — hair transformations, treatments, styling and more. Each photo reflects the care, skill and attention behind every client experience."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "booking-cta",
        "label": "Booking CTA",
        "content": {
          "heading": "Let's Create Your Next Look",
          "primaryButtonText": "Book Appointment",
          "eyebrow": "✦ READY FOR A CHANGE",
          "description": "Book your appointment and experience professional care at Salon Zage."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "primaryButton",
          "description"
        ],
        "defaultImage": "/images/cta-salon.jpg",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "reviews",
    "label": "Reviews",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "What Our Clients",
          "highlightedText": "Say About Salon Zage",
          "eyebrow": "CLIENT REVIEWS",
          "description": "Read real feedback from clients who have experienced our salon services."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "highlightedText",
          "description"
        ],
        "defaultImage": "/images/reviews-hero.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "reviews",
        "label": "Reviews Heading",
        "content": {
          "heading": "Client Feedback & Reviews",
          "eyebrow": "OUR CLIENTS",
          "description": "See what our valued guests say about their experience at Salon Zage.",
          "primaryButtonText": "Write a Review",
          "secondaryButtonText": "View on Google"
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description",
          "primaryButton",
          "secondaryButton"
        ]
      },
      {
        "key": "trust",
        "label": "Client Trust",
        "content": {
          "heading": "Care You Can Feel",
          "eyebrow": "WHY CLIENTS CHOOSE US",
          "description": "Our clients trust us for our professional care, personalized service and relaxing experience."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "booking-cta",
        "label": "Booking CTA",
        "content": {
          "heading": "Experience Salon Zage for Yourself",
          "primaryButtonText": "Book Appointment",
          "eyebrow": "✦ READY FOR YOUR VISIT",
          "description": "Choose your preferred service and continue to our salon booking system."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "primaryButton",
          "description"
        ],
        "defaultImage": "/images/cta-salon.jpg",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "contact",
    "label": "Contact",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Contact Information",
          "eyebrow": "GET IN TOUCH",
          "description": "Choose a Salon Zage branch to view its contact details, opening hours, and location."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "description"
        ],
        "defaultImage": "/images/contact-hero.jpg",
        "isHeroOrCta": true
      },
      {
        "key": "branch-contact",
        "label": "Branch Contact",
        "content": {},
        "styles": [
          "backgroundColor"
        ]
      },
      {
        "key": "opening-hours",
        "label": "Opening Hours",
        "content": {
          "heading": "Visit Us at a Time That Works for You",
          "eyebrow": "OPENING HOURS",
          "description": "Our opening hours may vary by branch. Select a location to view the weekly schedule."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "message",
        "label": "Send Us a Message",
        "content": {
          "heading": "We'd Love to Hear From You",
          "eyebrow": "SEND US A MESSAGE",
          "description": "Have a question or need more information? Complete the details below and we'll get back to you as soon as possible."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/contact/contact-message-salon.webp"
      },
      {
        "key": "quick-information",
        "label": "Quick Information",
        "content": {
          "heading": "Quick Information",
          "eyebrow": "FREQUENTLY ASKED",
          "description": "Here are some common questions to help you get started. If you need further assistance, feel free to contact us."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ],
        "media": ["sectionImage"],
        "defaultSectionImage": "/images/contact-faq.jpg"
      },
      {
        "key": "booking-cta",
        "label": "Booking CTA",
        "content": {
          "heading": "Book Your Next Appointment",
          "primaryButtonText": "Book Appointment",
          "eyebrow": "✦ READY FOR YOUR VISIT",
          "description": "Choose your preferred service and continue to our salon booking system."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "backgroundImage",
          "heading",
          "primaryButton",
          "description"
        ],
        "defaultImage": "/images/cta-salon.jpg",
        "isHeroOrCta": true
      }
    ]
  },
  {
    "key": "privacy",
    "label": "Privacy",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "heading": "Privacy Policy",
          "description": "Learn how Salon Zage handles information when you use our website and interact with our online services."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "document",
        "label": "Legal Document Typography",
        "styles": [
          "backgroundColor",
          "sectionHeading",
          "description"
        ]
      }
    ]
  },
  {
    "key": "terms",
    "label": "Terms",
    "sections": [
      {
        "key": "page",
        "label": "Page Defaults",
        "styles": [
          "backgroundColor",
          "textColor",
          "headingColor",
          "headingFont",
          "bodyFont"
        ]
      },
      {
        "key": "hero",
        "label": "Hero",
        "content": {
          "eyebrow": "LEGAL",
          "heading": "Terms & Conditions",
          "description": "Please read these terms carefully before using the Salon Zage website and its services."
        },
        "styles": [
          "backgroundColor",
          "alignment",
          "heading",
          "description"
        ]
      },
      {
        "key": "document",
        "label": "Legal Document Typography",
        "styles": [
          "backgroundColor",
          "sectionHeading",
          "description"
        ]
      }
    ]
  }
];
