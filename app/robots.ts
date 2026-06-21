import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/cars/", "/compare", "/car-request"],
        disallow: ["/admin/", "/login", "/register", "/wishlist"],
      },
    ],
    sitemap: "https://www.carkharedo.com/sitemap.xml", // Replace with your actual domain
  };
}
