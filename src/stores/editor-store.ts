'use client'

import { create } from 'zustand'
import type { Presentation, Section } from '@/types/database'

interface EditorState {
  presentation: Presentation | null
  sections: Section[]
  activeSection: string | null
  isGenerating: boolean
  isGeneratingVoice: boolean
  setPresentation: (p: Presentation) => void
  setSections: (s: Section[]) => void
  setActiveSection: (id: string | null) => void
  updateSection: (id: string, data: Partial<Section>) => void
  reorderSections: (ids: string[]) => void
  setGenerating: (v: boolean) => void
  setGeneratingVoice: (v: boolean) => void
}

export const useEditorStore = create<EditorState>()((set) => ({
  presentation: null,
  sections: [],
  activeSection: null,
  isGenerating: false,
  isGeneratingVoice: false,

  setPresentation: (presentation) => set({ presentation }),

  setSections: (sections) =>
    set({
      sections: sections.sort((a, b) => a.order - b.order),
      activeSection:
        sections.length > 0 ? sections.sort((a, b) => a.order - b.order)[0].id : null,
    }),

  setActiveSection: (id) => set({ activeSection: id }),

  updateSection: (id, data) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),

  reorderSections: (ids) =>
    set((state) => ({
      sections: ids
        .map((id, index) => {
          const section = state.sections.find((s) => s.id === id)
          return section ? { ...section, order: index } : null
        })
        .filter(Boolean) as Section[],
    })),

  setGenerating: (isGenerating) => set({ isGenerating }),
  setGeneratingVoice: (isGeneratingVoice) => set({ isGeneratingVoice }),
}))
