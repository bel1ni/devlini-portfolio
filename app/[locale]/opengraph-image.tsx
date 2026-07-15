import { ImageResponse } from "next/og";
import { profile, SITE_URL } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = profile.name;

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const headline =
    locale === "en" ? profile.headline.en : profile.headline.pt;

  // URL absoluta: em serverless o public/ não entra no bundle da função
  const badgeSrc = `${SITE_URL}/devlini-badge.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#09090b",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 760,
          }}
        >
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ marginTop: 20, fontSize: 30, color: "#34d399" }}>
            {headline}
          </div>
          <div style={{ marginTop: 40, fontSize: 24, color: "#71717a" }}>
            devlini.com
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeSrc} width={280} height={280} alt="" />
      </div>
    ),
    size,
  );
}
