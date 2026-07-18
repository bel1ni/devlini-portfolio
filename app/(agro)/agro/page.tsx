import AgroHero from "@/components/agro/agro-hero";
import NewsFeed from "@/components/agro/news-feed";
import Trending from "@/components/agro/trending";
import CreatorCard from "@/components/agro/creator-card";
import NewsletterForm from "@/components/agro/newsletter-form";
import AdSlot from "@/components/agro/ad-slot";
import { getBaseUrl } from "@/lib/agro/site-url";

// Revalida a cada 5 min para que notícias novas apareçam sem depender
// de um novo deploy (sem isso a página fica estática no build).
export const revalidate = 300;

export default function AgroHome() {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DEVLINI Agro",
    url: `${baseUrl}/agro`,
    description:
      "Notícias do agronegócio brasileiro: pecuária, agricultura, mercado, clima e política agrícola resumidas por inteligência artificial.",
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/agro?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <AgroHero />

      <NewsFeed />

      {/* Área sobre a criadora e os projetos, entre as notícias e o restante */}
      <CreatorCard />

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME}
        className="mt-10"
      />

      <Trending />

      <section id="newsletter" className="mt-12 scroll-mt-24">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Receba por e-mail
        </h2>
        <div className="mt-3 max-w-md">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
