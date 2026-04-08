'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Presentation } from '@/types/database'

interface AggregateStats {
  totalViews: number
  totalPresentations: number
  avgCompletionRate: number
  topPresentations: Presentation[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AggregateStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch all presentations
        const { data: presentations } = await supabase
          .from('presentations')
          .select('*')
          .eq('user_id', user.id)
          .order('view_count', { ascending: false })

        const all = presentations ?? []
        const totalViews = all.reduce((sum, p) => sum + (p.view_count ?? 0), 0)

        // Fetch views for completion rate
        const { data: views } = await supabase
          .from('presentation_views')
          .select('completed, presentation_id')
          .in('presentation_id', all.map((p) => p.id))

        const allViews = views ?? []
        const completedViews = allViews.filter((v) => v.completed).length
        const avgCompletionRate = allViews.length > 0
          ? Math.round((completedViews / allViews.length) * 100)
          : 0

        setStats({
          totalViews,
          totalPresentations: all.length,
          avgCompletionRate,
          topPresentations: all.slice(0, 5),
        })
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span className="text-sm">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Failed to load analytics.
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      label: 'Presentations',
      value: stats.totalPresentations.toString(),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: 'Avg Completion Rate',
      value: `${stats.avgCompletionRate}%`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of all your presentations performance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {card.icon}
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {card.label}
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Top Presentations */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Top Presentations by Views</h2>
        </div>

        {stats.topPresentations.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No presentations yet. Create one to start tracking analytics.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Presentation</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Views</th>
                <th className="text-right px-5 py-3 font-medium">Created</th>
                <th className="text-right px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.topPresentations.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {p.title || 'Untitled'}
                    </p>
                    {p.company_name && (
                      <p className="text-xs text-muted-foreground">{p.company_name}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      p.status === 'published'
                        ? 'bg-indigo-900/60 text-indigo-300'
                        : p.status === 'ready'
                          ? 'bg-emerald-900/60 text-emerald-300'
                          : 'bg-zinc-700 text-zinc-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-foreground font-medium">
                    {p.view_count.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => router.push(`/analytics/${p.id}`)}
                      className="text-xs text-primary hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
