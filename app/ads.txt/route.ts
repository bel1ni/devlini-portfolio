export function GET() {
		const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

		if (!adsenseClient) {
				return new Response("Not found", { status: 404 })
		}

		// O AdSense usa o formato "ca-pub-XXXX" no script, mas o ads.txt exige "pub-XXXX"
		const publisherId = adsenseClient.replace(/^ca-/, "")

		return new Response(
				`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
				{
						headers: {
								"Content-Type": "text/plain",
						},
				}
		)
}
