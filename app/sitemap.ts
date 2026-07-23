import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getSavedNews } from "@/lib/agro/supabase/get-news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/en",
    "/sobre",
    "/anuncie",
    "/en/anuncie",
    "/agro",
    "/agro/briefing",
    "/agro/sobre",
    "/agro/privacidade",
    "/agro/termos",
    "/agro/contato",
  ].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
  }));

  // Notícias do agro: se o banco estiver indisponível, getSavedNews devolve []
  const news = await getSavedNews();

  const newsPaths = news.slice(0, 500).map((item) => ({
    url: `${SITE_URL}/agro/news/${encodeURIComponent(item.id)}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
  }));

  return [...staticPaths, ...newsPaths];
}
