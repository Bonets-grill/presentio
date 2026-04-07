import type { Profile, Tenant } from '@/types/database'

export const DEMO_CREDENTIALS = {
  email: 'demo@markify.eu',
  password: 'demo2026',
}

export const DEMO_TENANT: Tenant = {
  id: 'demo-tenant-001',
  name: 'Markify Demo Corp',
  slug: 'markify-demo',
  domain: null,
  plan: 'pro',
  api_key_hash: null,
  api_key_prefix: null,
  usage_quota_monthly: 10000,
  usage_current_monthly: 2847,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  settings: {},
  created_at: '2026-03-01T00:00:00Z',
  updated_at: '2026-04-07T00:00:00Z',
}

export const DEMO_PROFILE: Profile = {
  id: 'demo-user-001',
  tenant_id: 'demo-tenant-001',
  email: 'demo@markify.eu',
  full_name: 'Demo User',
  role: 'owner',
  created_at: '2026-03-01T00:00:00Z',
}

export function isDemoLogin(email: string, password: string): boolean {
  return email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
}

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('markify_demo') === 'true'
}

export function setDemoMode(active: boolean): void {
  if (typeof window === 'undefined') return
  if (active) {
    localStorage.setItem('markify_demo', 'true')
  } else {
    localStorage.removeItem('markify_demo')
  }
}
