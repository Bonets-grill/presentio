'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/lib/i18n/translations'
import type { Profile } from '@/types/database'

export type ThemeMode = 'dark' | 'light' | 'system'

interface AppState {
  lang: Lang
  theme: ThemeMode
  sidebarOpen: boolean
  user: Profile | null

  setLang: (lang: Lang) => void
  setTheme: (theme: ThemeMode) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setUser: (user: Profile | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'en',
      theme: 'dark',
      sidebarOpen: true,
      user: null,

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setUser: (user) => set({ user }),
      reset: () => set({ user: null }),
    }),
    {
      name: 'presentio_app',
      partialize: (state) => ({
        lang: state.lang,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
