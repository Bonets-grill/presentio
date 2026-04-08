'use client'

import { useState } from 'react'
import { useAppStore } from '@/stores/app-store'
import type { Plan } from '@/types/database'

interface PlanCard {
  name: string
  price: string
  priceLabel: string
  presentations: string
  voice: string
  features: string[]
  popular?: boolean
  stripePlan?: string
}

const PLANS: Record<Plan, PlanCard> = {
  free: {
    name: 'Free',
    price: '$0',
    priceLabel: '/mo',
    presentations: '2 presentations/month',
    voice: '5 min voice/month',
    features: [
      'AI-generated presentations',
      'Basic analytics',
      'Public sharing',
      'Presentio branding',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$29',
    priceLabel: '/mo',
    presentations: 'Unlimited presentations',
    voice: '30 min voice/month',
    popular: true,
    stripePlan: 'pro',
    features: [
      'Everything in Free',
      'No branding',
      'Custom themes',
      'Full analytics dashboard',
      'Priority support',
    ],
  },
  team: {
    name: 'Team',
    price: '$49',
    priceLabel: '/user/mo',
    presentations: 'Unlimited presentations',
    voice: '100 min voice/month',
    stripePlan: 'team',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'CRM integrations',
      'Custom domains',
      'Dedicated support',
    ],
  },
}

export default function BillingPage() {
  const { user } = useAppStore()
  const currentPlan: Plan = user?.plan ?? 'free'
  const [upgrading, setUpgrading] = useState<string | null>(null)

  async function handleUpgrade(plan: string) {
    setUpgrading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          success_url: `${window.location.origin}/billing?success=true`,
          cancel_url: `${window.location.origin}/billing?canceled=true`,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // silently fail
    } finally {
      setUpgrading(null)
    }
  }

  const presentationsUsed = user?.presentations_count ?? 0
  const presentationsLimit = user?.presentations_limit ?? 2
  const voiceUsed = user?.voice_minutes_used ?? 0
  const voiceLimit = user?.voice_minutes_limit ?? 5

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and usage.
        </p>
      </div>

      {/* Usage Stats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Current Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Presentations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Presentations</p>
              <p className="text-sm font-medium text-foreground">
                {presentationsUsed} / {presentationsLimit === -1 ? 'Unlimited' : presentationsLimit}
              </p>
            </div>
            {presentationsLimit !== -1 && (
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min((presentationsUsed / presentationsLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Voice Minutes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Voice Minutes</p>
              <p className="text-sm font-medium text-foreground">
                {Math.round(voiceUsed * 10) / 10} / {voiceLimit} min
              </p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${Math.min((voiceUsed / voiceLimit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Choose Your Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Object.entries(PLANS) as [Plan, PlanCard][]).map(([key, plan]) => {
            const isCurrent = key === currentPlan
            const isUpgrading = upgrading === plan.stripePlan

            return (
              <div
                key={key}
                className={`bg-card border rounded-xl p-6 flex flex-col relative ${
                  plan.popular
                    ? 'border-primary ring-1 ring-primary/20'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>

                <div className="mt-3 mb-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceLabel}</span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary shrink-0">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    {plan.presentations}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary shrink-0">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    {plan.voice}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400 shrink-0 mt-0.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => plan.stripePlan && handleUpgrade(plan.stripePlan)}
                  disabled={isCurrent || isUpgrading || !plan.stripePlan}
                  className={`mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isUpgrading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                      </svg>
                      Redirecting...
                    </span>
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Manage Subscription */}
      {currentPlan !== 'free' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-2">Manage Subscription</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Update payment method, cancel, or change your billing cycle.
          </p>
          <button
            onClick={async () => {
              const res = await fetch('/api/stripe/portal', { method: 'POST' })
              const data = await res.json()
              if (data.url) window.location.href = data.url
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Manage in Stripe
          </button>
        </div>
      )}
    </div>
  )
}
