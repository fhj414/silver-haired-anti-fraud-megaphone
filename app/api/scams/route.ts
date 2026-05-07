import { NextResponse } from "next/server";
import { getScamFeed } from "@/lib/scams";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getScamFeed();
  return NextResponse.json(feed);
}
