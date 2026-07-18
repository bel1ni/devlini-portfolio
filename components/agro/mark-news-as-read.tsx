"use client"

import { useEffect } from "react"
import { markNewsAsRead } from "@/lib/agro/read-news"

type MarkNewsAsReadProps = {
		newsId: string | number
}

export default function MarkNewsAsRead({
		newsId,
}: MarkNewsAsReadProps) {
		useEffect(() => {
				markNewsAsRead(newsId)
		}, [newsId])

		return null
}