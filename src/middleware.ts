import { updateSession } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n for API routes, public viewer routes, and landing page
  if (pathname.startsWith('/api') || pathname.startsWith('/p/') || pathname === '/') {
    return await updateSession(request)
  }

  // Run next-intl middleware first (handles locale detection/redirect)
  const intlResponse = intlMiddleware(request)

  // If intl middleware redirected, return that redirect
  if (intlResponse.status !== 200) {
    return intlResponse
  }

  // Then run Supabase auth session update
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
