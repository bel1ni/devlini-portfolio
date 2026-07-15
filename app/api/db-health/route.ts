import { NextResponse } from "next/server";
import { dbHealth } from "@/lib/ads-db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await dbHealth());
}
