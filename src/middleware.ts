import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");

  let shouldRedirect = false;
  let targetHost = host;
  let targetProto = proto;

  // 1. Apex to canonical host (yuitility.app -> www.yuitility.app)
  if (host === "yuitility.app") {
    targetHost = "www.yuitility.app";
    shouldRedirect = true;
  }

  // 2. HTTP to HTTPS upgrade on live domain
  if ((host === "yuitility.app" || host === "www.yuitility.app") && proto === "http") {
    targetProto = "https";
    shouldRedirect = true;
  }

  // 3. Lowercase path normalization
  let normalizedPath = pathname;
  if (pathname !== pathname.toLowerCase()) {
    normalizedPath = pathname.toLowerCase();
    shouldRedirect = true;
  }

  // 4. Remove trailing slash on subpaths (except root '/')
  if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    const destination = `${targetProto}://${targetHost}${normalizedPath}${search}`;
    return NextResponse.redirect(destination, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files with extensions (svg, png, jpg, jpeg, gif, webp, ico, txt, xml, webmanifest, json, wasm)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest|json|wasm)$).*)",
  ],
};
