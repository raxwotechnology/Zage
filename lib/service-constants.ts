export const DEFAULT_SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatments",
  "Facial & Skin Care",
  "Makeup",
  "Nail Care",
  "Threading & Waxing",
  "Massage & Spa",
] as const;

export type DefaultServiceCategory = (typeof DEFAULT_SERVICE_CATEGORIES)[number];
