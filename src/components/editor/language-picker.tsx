'use client'

import { Select } from '@/components/ui/select'
import type { Language } from '@/types/database'

const languages: { value: Language; label: string }[] = [
  { value: 'es', label: '\u{1F1EA}\u{1F1F8} Espa\u00f1ol' },
  { value: 'en', label: '\u{1F1EC}\u{1F1E7} English' },
  { value: 'fr', label: '\u{1F1EB}\u{1F1F7} Fran\u00e7ais' },
  { value: 'de', label: '\u{1F1E9}\u{1F1EA} Deutsch' },
  { value: 'pt', label: '\u{1F1F5}\u{1F1F9} Portugu\u00eas' },
  { value: 'it', label: '\u{1F1EE}\u{1F1F9} Italiano' },
]

interface LanguagePickerProps {
  value: Language
  onChange: (lang: Language) => void
  label?: string
}

export function LanguagePicker({ value, onChange, label }: LanguagePickerProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </Select>
  )
}
