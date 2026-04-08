import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // For MVP: no locale-based URL routing — just auth session management
  // next-intl is used for translation strings only (via server/client providers)
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
