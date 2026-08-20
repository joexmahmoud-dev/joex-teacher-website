import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/db/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أ/ كريم حسن — مدرس رياضيات",
    short_name: "Karim Math",
    description: "Mathematics lessons, study materials and online exams for secondary students in Cairo.",
    start_url: "/ar",
    dir: "rtl",
    lang: "ar",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#0e5a4b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
