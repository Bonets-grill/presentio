import type { CardGridContent } from '@/types/presentation'

interface CardGridProps {
  content: CardGridContent
}

const badgeColorMap: Record<string, string> = {
  green: 'bg-[rgba(34,197,94,0.15)] text-[var(--success)]',
  yellow: 'bg-[rgba(245,158,11,0.15)] text-[var(--warning)]',
  red: 'bg-[rgba(239,68,68,0.15)] text-[var(--danger)]',
  blue: 'bg-[rgba(59,130,246,0.15)] text-[var(--info)]',
  purple: 'bg-[rgba(168,85,247,0.15)] text-[#a855f7]',
  gold: 'bg-[rgba(212,168,67,0.15)] text-[var(--accent)]',
}

export function CardGrid({ content }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {content.cards.map((card, i) => (
        <div
          key={i}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 transition-all duration-300 hover:border-[rgba(26,92,56,0.4)]"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {card.icon && <span className="text-xl">{card.icon}</span>}
              <h4 className="font-semibold text-[0.85rem] text-[var(--text)]">
                {card.title}
              </h4>
            </div>
            {card.badge && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold ${
                  badgeColorMap[card.badgeColor ?? 'green'] ?? ''
                }`}
              >
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-[0.78rem] text-[var(--text-muted)]">{card.description}</p>
        </div>
      ))}
    </div>
  )
}
