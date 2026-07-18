import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Logos das fontes de notícias da seção /agro
    remotePatterns: [{ protocol: "https", hostname: "logo.clearbit.com" }],
  },
};

export default withNextIntl(nextConfig);
