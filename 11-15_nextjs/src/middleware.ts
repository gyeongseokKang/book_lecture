import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Rate Limiting을 위한 간단한 메모리 저장소
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate Limiting 설정
const RATE_LIMIT = {
  maxRequests: 10, // 최대 요청 수
  windowMs: 60 * 1000, // 1분
};

export async function middleware(request: NextRequest) {
  // console.log("[middleware]", request.nextUrl.pathname);

  const pathnameWithoutLocale = await getPathnameWithoutLocale(
    request.nextUrl.pathname
  );

  // 브라우저별 리다이렉트
  const userAgent = request.headers.get("user-agent") || "";
  // console.log("[userAgent]", userAgent);

  // const isChrome =
  //   /Chrome/i.test(userAgent) && !/Edge|Edg|OPR|Opera/i.test(userAgent);
  // const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);

  // if (isChrome && pathnameWithoutLocale === "/") {
  //   return NextResponse.redirect(new URL("/chrome", request.url));
  // }

  // if (isSafari && pathnameWithoutLocale === "/") {
  //   return NextResponse.redirect(new URL("/safari", request.url));
  // }

  const cookieStore = await cookies();
  const authUser = cookieStore.get("auth-user");

  // /private 경로는 인증 체크
  if (pathnameWithoutLocale.startsWith("/private") && !authUser) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathnameWithoutLocale === "/auth/login" && authUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathnameWithoutLocale === "/auth/logout" && !authUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internal routes)
     * - public (public routes that don't need middleware)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|_vercel|public|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source:
        "/((?!api|_next/static|_next/image|_vercel|public|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source:
        "/((?!api|_next/static|_next/image|_vercel|public|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};

const getPathnameWithoutLocale = async (originPathname: string) => {
  const firstSegment = originPathname.split("/")[1];

  if (["ko", "en"].includes(firstSegment)) {
    return originPathname.replace(`/${firstSegment}`, "");
  }

  return originPathname;
};
