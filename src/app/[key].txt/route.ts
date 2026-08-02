import { getIndexingConfig } from "@/src/lib/indexnow";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const config = getIndexingConfig();

  if (key === config.apiKey) {
    return new NextResponse(config.apiKey, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }

  return new NextResponse("Not Found", { status: 404 });
}
