import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Favicons das fontes de notícias da seção /agro (clearbit foi desligado;
    // o padrão dele fica só para linhas antigas do banco via resolveLogo)
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons" },
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
