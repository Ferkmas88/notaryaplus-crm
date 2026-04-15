import { NextRequest, NextResponse } from "next/server";
import { getSource, buildWaLink } from "@/lib/sources";
import { logClick } from "@/lib/bot-api";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { source: string } }
) {
  const source = getSource(params.source);
  if (!source) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Log click (fire and forget — no await)
  const ua = req.headers.get("user-agent") || "";
  const ref = req.headers.get("referer") || "";
  logClick(source.id, ua, ref).catch(() => {});

  const waUrl = buildWaLink(source.message);
  return NextResponse.redirect(waUrl, 302);
}
