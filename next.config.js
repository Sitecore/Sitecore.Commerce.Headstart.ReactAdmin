/** @type {import('next').NextConfig} */

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx"
})

module.exports = withNextra({
  devIndicators: {
    autoPrerender: true
  },
  pwa: {
    disable:
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "preview" ||
      process.env.NODE_ENV === "production",
    // delete two lines above to enable PWA in production deployment
    // add your own icons to public/manifest.json
    // to re-generate manifest.json, you can visit https://tomitm.github.io/appmanifest/
    dest: "public",
    register: true
  },
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    dirs: ["src"]
  },
  // !! WARN !!
  ignoreBuildErrors: true
})
