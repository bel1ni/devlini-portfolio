import { ImageResponse } from "next/og"

export const alt = "DEVLINI Agro — Notícias do agronegócio brasileiro"

export const size = {
    width: 1200,
    height: 630,
}

export const contentType = "image/png"

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "80px",
                    background:
                        "linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)",
                    color: "#ffffff",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        fontSize: "44px",
                        fontWeight: 700,
                        color: "#6ee7b7",
                    }}
                >
                    🌱 DEVLINI Agro
                </div>

                <div
                    style={{
                        marginTop: "36px",
                        fontSize: "76px",
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-2px",
                        maxWidth: "980px",
                    }}
                >
                    O agro do Brasil, resumido todos os dias.
                </div>

                <div
                    style={{
                        marginTop: "36px",
                        fontSize: "32px",
                        color: "#a7f3d0",
                    }}
                >
                    Pecuária · Agricultura · Mercado · Clima · Política Agro
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
