import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the dev badge out of art-source plate captures (scripts/render-plates.mjs)
  devIndicators: false,
};

export default nextConfig;
