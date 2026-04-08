import type { FooterContent } from '@/types/presentation'

interface FooterSectionProps {
  content: FooterContent
}

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <div className="text-center p-8 text-[var(--text-muted)] text-[0.75rem] border-t border-[var(--border)]">
      <p>
        {content.companyName}
        {content.tagline && ` — ${content.tagline}`}
      </p>
      {(content.date || content.validUntil) && (
        <p className="mt-1">
          {content.date && `Generado: ${content.date}`}
          {content.date && content.validUntil && ' — '}
          {content.validUntil && `Valida hasta: ${content.validUntil}`}
        </p>
      )}
    </div>
  )
}
