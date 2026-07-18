export function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    // Em produção o site unificado vive no domínio do hub.
    if (process.env.NODE_ENV === "production") {
        return "https://devlini.com"
    }

    return "http://localhost:3000"
}
