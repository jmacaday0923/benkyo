import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Redirects `/` to `/en` or `/ja` (based on the browser's language or a
// previously chosen locale) and keeps every page under a locale prefix.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js internals and files with an
  // extension (e.g. favicon.ico).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
