import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://car-kharedo.vercel.app/";
const vercelEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";

export default function robots(): MetadataRoute.Robots {
  // For preview/staging builds, disallow all crawling to avoid accidental indexing
  if (vercelEnv !== "production") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"],
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/cars", "/cars/*", "/compare", "/car-request"],
        disallow: ["/admin", "/admin/*", "/login", "/register", "/wishlist", "/api/admin/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
