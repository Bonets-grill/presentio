'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface AnalyticsData {
  total_views: number
  avg_time: number
  completion_rate: number
  voice_start_rate: number
  views_by_day: Record<string, number>
}

interface PresentationInfo {
  title: string
  company_name: string | null
}

export default function PresentationAnalyticsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [presentation, setPresentation] = useState<PresentationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const id = params.id

        // Fetch analytics
        const analyticsRes = await fetch(`/api/presentations/${id}/analytics`)
        if (!analyticsRes.ok) {
          setError('Failed to load analytics')
          return
        }
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)

        // Fetch presentation info
        const presRes = await fetch(`/api/presentations/${id}`)
        if (presRes.ok) {
          const presData = await presRes.json()
          setPresentation({ title: presData.title, company_name: presData.company_name })
        }
      } catch {
        setError('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params.id])

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

  if (error || !analytics) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">{error ?? 'No analytics data found.'}</p>
        <button
          onClick={() => router.push('/analytics')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Back to Analytics
        </button>
      </div>
    )
  }

  // Prepare chart data (last 30 days)
  const days: { date: string; label: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: analytics.views_by_day[key] ?? 0,
    })
  }

  const maxViews = Math.max(...days.map((d) => d.count), 1)

  const statCards = [
    {
      label: 'Total Views',
      value: analytics.total_views.toLocaleString(),
    },
    {
      label: 'Avg Time',
      value: `${Math.round(analytics.avg_time)}s`,
    },
    {
      label: 'Completion Rate',
      value: `${Math.round(analytics.completion_rate * 100)}%`,
    },
    {
      label: 'Voice Start Rate',
      value: `${Math.round(analytics.voice_start_rate * 100)}%`,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push('/analytics')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Analytics
        </button>
        <h1 className="text-2xl font-semibold text-foreground">
          {presentation?.title ?? 'Presentation Analytics'}
        </h1>
        {presentation?.company_name && (
          <p className="text-sm text-muted-foreground mt-1">{presentation.company_name}</p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Views Over Time - Bar Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Views Over Time (Last 30 Days)</h2>

        {analytics.total_views === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No views yet. Share your presentation to start getting views.
          </div>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {days.map((day) => {
              const heightPct = maxViews > 0 ? (day.count / maxViews) * 100 : 0
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {day.label}: {day.count}
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t bg-primary/70 hover:bg-primary transition-colors min-h-[2px]"
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* X-axis labels (show every 5th day) */}
        <div className="flex gap-1 mt-2">
          {days.map((day, i) => (
            <div key={day.date} className="flex-1 text-center">
              {i % 5 === 0 && (
                <span className="text-[9px] text-muted-foreground">{day.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
