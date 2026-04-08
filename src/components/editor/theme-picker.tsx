'use client'

const themes = [
  { name: 'Emerald', primary: '#1a5c38', accent: '#d4a843', bg: '#0a0f0d' },
  { name: 'Ocean', primary: '#1e40af', accent: '#f59e0b', bg: '#0a0d1a' },
  { name: 'Sunset', primary: '#b91c1c', accent: '#f97316', bg: '#1a0a0a' },
  { name: 'Royal', primary: '#6d28d9', accent: '#eab308', bg: '#0f0a1a' },
  { name: 'Slate', primary: '#475569', accent: '#06b6d4', bg: '#0f1117' },
  { name: 'Coral', primary: '#be185d', accent: '#fbbf24', bg: '#1a0a10' },
]

interface ThemePickerProps {
  selectedPreset: string | null
  onSelect: (theme: { name: string; primary: string; accent: string; bg: string }) => void
}

export function ThemePicker({ selectedPreset, onSelect }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Tema visual</label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            type="button"
            onClick={() => onSelect(theme)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-colors cursor-pointer ${
              selectedPreset === theme.name
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <div className="flex gap-1">
              <span
                className="h-4 w-4 rounded-full border border-white/10"
                style={{ backgroundColor: theme.primary }}
              />
              <span
                className="h-4 w-4 rounded-full border border-white/10"
                style={{ backgroundColor: theme.accent }}
              />
              <span
                className="h-4 w-4 rounded-full border border-white/10"
                style={{ backgroundColor: theme.bg }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
