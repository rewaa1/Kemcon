import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kemcon — Premium Fabrics & Furnishings",
    short_name: "Kemcon",
    description:
      "Premium fabrics and furnishings trusted by luxury hotels across the Middle East.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0B14",
    theme_color: "#0D0B14",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
