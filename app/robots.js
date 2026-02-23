export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://dev-signal.vercel.app/sitemap.xml",
  };
}
