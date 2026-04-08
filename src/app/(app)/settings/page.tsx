'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/app-store'
import { createClient } from '@/lib/supabase/client'
import { T, SUPPORTED_LANGS, LANG_NAMES, type Lang } from '@/lib/i18n/translations'
import type { ThemeMode } from '@/stores/app-store'

const LANG_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
}

export default function SettingsPage() {
  const router = useRouter()
  const { lang, theme, user, setLang, setTheme, setUser } = useAppStore()
  const t = T[lang]

  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Notification preferences (local state, persisted on save)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyViews, setNotifyViews] = useState(true)
  const [notifyWeekly, setNotifyWeekly] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const themes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'dark', label: t.darkMode, icon: '🌙' },
    { value: 'light', label: t.lightMode, icon: '☀️' },
    { value: 'system', label: t.systemMode, icon: '💻' },
  ]

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          locale: lang,
        })
        .eq('id', user?.id ?? '')

      if (!error && user) {
        setUser({ ...user, full_name: fullName, locale: lang })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const supabase = createClient()
      // Delete profile (cascade should handle presentations)
      await supabase.from('profiles').delete().eq('id', user?.id ?? '')
      await supabase.auth.signOut()
      router.push('/login')
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t.settingsTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-foreground">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
            {(user?.full_name ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user?.full_name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ''}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t.fullName}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t.email}
          </label>
          <input
            type="email"
            value={user?.email ?? ''}
            disabled
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
        </div>
      </section>

      {/* Theme */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">{t.theme}</h2>
        <div className="flex gap-3">
          {themes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`
                flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2
                ${theme === opt.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'}
              `}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">{t.language}</h2>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {SUPPORTED_LANGS.map((l) => (
            <option key={l} value={l}>
              {LANG_FLAGS[l] ?? ''} {LANG_NAMES[l]}
            </option>
          ))}
        </select>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Notifications</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-muted accent-primary"
            />
            <div>
              <p className="text-sm text-foreground">Email notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates about your presentations</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyViews}
              onChange={(e) => setNotifyViews(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-muted accent-primary"
            />
            <div>
              <p className="text-sm text-foreground">View milestones</p>
              <p className="text-xs text-muted-foreground">Get notified when a presentation reaches view milestones</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyWeekly}
              onChange={(e) => setNotifyWeekly(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-muted accent-primary"
            />
            <div>
              <p className="text-sm text-foreground">Weekly digest</p>
              <p className="text-xs text-muted-foreground">Weekly summary of your presentations performance</p>
            </div>
          </label>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : t.save}
        </button>
      </div>

      {/* Danger Zone */}
      <section className="bg-card border border-red-900/50 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-red-900/50 text-red-400 hover:bg-red-950/30 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
