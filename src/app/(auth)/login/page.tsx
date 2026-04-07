'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/app-store'
import { T } from '@/lib/i18n/translations'
import { isDemoLogin, DEMO_PROFILE, DEMO_TENANT, setDemoMode } from '@/lib/demo/auth'

export default function LoginPage() {
  const router = useRouter()
  const { lang, setUser, setTenant } = useAppStore()
  const t = T[lang]

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Demo mode — bypass Supabase
    if (isDemoLogin(email, password)) {
      setDemoMode(true)
      setUser(DEMO_PROFILE)
      setTenant(DEMO_TENANT)
      router.push('/dashboard')
      return
    }

    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })

      if (err) {
        setError(t.invalidCredentials)
        setLoading(false)
        return
      }

      setDemoMode(false)
      router.push('/dashboard')
    } catch {
      setError(t.invalidCredentials)
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6 text-center">{t.login}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.password}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50"
        >
          {loading ? t.loading : t.login}
        </button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        {t.dontHaveAccount}{' '}
        <Link href="/register" className="text-primary hover:underline">
          {t.register}
        </Link>
      </p>

      {/* Demo credentials */}
      <div className="mt-6 border-t border-border pt-5">
        <button
          type="button"
          onClick={() => {
            setEmail('demo@markify.eu')
            setPassword('demo2026')
          }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition border border-dashed border-border rounded-lg py-2.5 hover:border-primary/50"
        >
          Use demo credentials
        </button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          demo@markify.eu / demo2026
        </p>
      </div>
    </div>
  )
}
