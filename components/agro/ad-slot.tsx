"use client"

import { useEffect } from "react"

const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

declare global {
		interface Window {
				adsbygoogle?: unknown[]
		}
}

type AdSlotProps = {
		slot?: string
		className?: string
}

export default function AdSlot({ slot, className }: AdSlotProps) {
		useEffect(() => {
				if (!adClient || !slot) return

				try {
						;(window.adsbygoogle = window.adsbygoogle || []).push({})
				} catch {
						// AdSense ainda não carregou; o script cuida disso no próximo push
				}
		}, [slot])

		if (!adClient || !slot) return null

		return (
				<div className={className}>
						{/* Rótulo de boa prática do AdSense: num feed de notícias, o
						   anúncio precisa ser distinguível do conteúdo. */}
						<p className="mb-1 text-center text-[10px] uppercase tracking-widest text-zinc-300">
								Publicidade
						</p>
						<ins
								className="adsbygoogle"
								style={{ display: "block" }}
								data-ad-client={adClient}
								data-ad-slot={slot}
								data-ad-format="auto"
								data-full-width-responsive="true"
						/>
				</div>
		)
}
