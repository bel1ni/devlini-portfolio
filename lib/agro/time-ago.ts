import type { Locale } from "@/lib/agro/i18n/config"

export function timeAgo(isoDate: string | null | undefined, locale: Locale) {
    if (!isoDate) return ""

    const published = new Date(isoDate).getTime()

    if (Number.isNaN(published)) return ""

    const diffInSeconds = Math.round((published - Date.now()) / 1000)

    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

    const minutes = Math.round(diffInSeconds / 60)
    const hours = Math.round(diffInSeconds / 3600)
    const days = Math.round(diffInSeconds / 86400)

    if (Math.abs(minutes) < 1) {
        return formatter.format(0, "minute")
    }

    if (Math.abs(minutes) < 60) {
        return formatter.format(minutes, "minute")
    }

    if (Math.abs(hours) < 24) {
        return formatter.format(hours, "hour")
    }

    return formatter.format(days, "day")
}
