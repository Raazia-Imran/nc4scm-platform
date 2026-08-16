// next.config.js
// -----------------------------------------------------------------------------
// Core Next.js configuration. The `images.remotePatterns` allow-list is a
// data-safety measure: Next.js's built-in <Image> optimizer refuses to load
// images from any domain not explicitly whitelisted here, which prevents the
// app from being used as an open image proxy for arbitrary/untrusted URLs.
// We whitelist only Sanity's CDN, which is where all of our media assets
// (avatars, logos, cover images) are actually hosted.
// -----------------------------------------------------------------------------
/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
