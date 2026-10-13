import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SALVORA Salon | Look Beautiful. Feel Confident.",
    short_name: "SALVORA",
    description:
      "Premier beauty care, modern hair treatments, and bridal styling in Sri Lanka at SALVORA Salon.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#03BF62",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
