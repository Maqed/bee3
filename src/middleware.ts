import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./config";
import { NextRequest, NextResponse } from "next/server";
import {
  ONLY_UNAUTHENTICATED_ROUTES,
  DEFAULT_UNAUTHENTICATED_REDIRECT,
  PROTECTED_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  ADMIN_ROUTES,
} from "./consts/routes";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import { absoluteURL } from "./lib/utils";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "ar",

  // Configure locale prefix behavior
  localePrefix,
});

export default async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req, {
    cookiePrefix: "bee3",
  });

  // Remove locale and clean pathname
  const localeMatch = req.nextUrl.pathname.match(/^\/(ar|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : null;
  const pathnameWithoutLocale = locale
    ? req.nextUrl.pathname.replace(`/${locale}`, "") || "/"
    : req.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(
        new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, req.url),
      );
    }
    if (isAdminRoute) {
      const data = await fetch(absoluteURL("/api/auth/get-session"), {
        headers: headers(),
      });
      const session = await data.json();
      if (session?.user.role !== "admin") {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
      }
    }
  }

  if (
    sessionCookie &&
    ONLY_UNAUTHENTICATED_ROUTES.some((route) =>
      pathnameWithoutLocale.startsWith(route),
    )
  ) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the middleware will be invoked.
  // Copied from https://next-intl-docs.vercel.app/docs/routing/middleware#matcher-no-prefix
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // However, match all pathnames
    "/([\\w-]+)",
  ],
};
