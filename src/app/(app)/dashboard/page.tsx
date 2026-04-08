'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Presentation } from '@/types/database'

const LANGUAGE_FLAGS: Record<string, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇧🇷',
  it: '🇮🇹',
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-zinc-700 text-zinc-300' },
  generating: { label: 'Generating', className: 'bg-amber-900/60 text-amber-300 animate-pulse' },
  ready: { label: 'Ready', className: 'bg-emerald-900/60 text-emerald-300' },
  published: { label: 'Published', className: 'bg-indigo-900/60 text-indigo-300' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchPresentations()
  }, [])

  async function fetchPresentations() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('presentations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      setPresentations(data ?? [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    setCreating(true)
    try {
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Presentation',
          language: 'es',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/editor/${data.id}`)
      }
    } catch {
      // silently fail
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this presentation?')) return
    setDeletingId(id)
    try {
      const supabase = createClient()
      await supabase.from('presentations').delete().eq('id', id)
      setPresentations((prev) => prev.filter((p) => p.id !== id))
    } catch {
      // silently fail
    } finally {
      setDeletingId(null)
    }
  }

  async function handleCopyLink(slug: string, id: string) {
    const url = `${window.location.origin}/p/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span className="text-sm">Loading presentations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Presentations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage your AI-powered presentations.
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {creating ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
          New Presentation
        </button>
      </div>

      {/* Empty State */}
      {presentations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No presentations yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Create your first AI-powered presentation. Describe your product and we will generate the content, design, and voice narration.
          </p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Create Your First Presentation
          </button>
        </div>
      )}

      {/* Grid */}
      {presentations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presentations.map((p) => {
            const status = STATUS_STYLES[p.status] ?? STATUS_STYLES.draft
            return (
              <div
                key={p.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors"
              >
                {/* Thumbnail gradient */}
                <div
                  className="h-32 relative"
                  style={{
                    background: `linear-gradient(135deg, ${p.theme_primary}, ${p.theme_accent})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-lg">
                    {LANGUAGE_FLAGS[p.language] ?? '🌐'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {p.title || 'Untitled'}
                    </h3>
                    {p.company_name && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {p.company_name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {p.view_count} views
                    </span>
                    <span>
                      {new Date(p.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => router.push(`/editor/${p.id}`)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors"
                    >
                      Edit
                    </button>
                    {p.status === 'published' && p.slug && (
                      <button
                        onClick={() => handleCopyLink(p.slug!, p.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors"
                      >
                        {copiedId === p.id ? 'Copied!' : 'Copy Link'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
                    >
                      {deletingId === p.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
