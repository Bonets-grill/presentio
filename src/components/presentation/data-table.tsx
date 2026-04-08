import type { DataTableContent } from '@/types/presentation'

interface DataTableProps {
  content: DataTableContent
}

const badgePatterns: Record<string, string> = {
  green: 'bg-[rgba(34,197,94,0.15)] text-[var(--success)]',
  yellow: 'bg-[rgba(245,158,11,0.15)] text-[var(--warning)]',
  red: 'bg-[rgba(239,68,68,0.15)] text-[var(--danger)]',
  blue: 'bg-[rgba(59,130,246,0.15)] text-[var(--info)]',
  purple: 'bg-[rgba(168,85,247,0.15)] text-[#a855f7]',
  gold: 'bg-[rgba(212,168,67,0.15)] text-[var(--accent)]',
}

function detectBadge(value: string): { text: string; color: string } | null {
  const badgeMatch = value.match(/^\[badge:(\w+)\](.+)$/)
  if (badgeMatch) return { color: badgeMatch[1], text: badgeMatch[2] }
  return null
}

export function DataTable({ content }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      {content.title && (
        <h4 className="text-[0.85rem] mb-4 text-[var(--primary-light)]">
          {content.title}
        </h4>
      )}
      <table className="w-full border-separate border-spacing-0 text-[0.78rem]">
        <thead>
          <tr>
            {content.headers.map((header, i) => (
              <th
                key={i}
                className={`bg-[rgba(26,92,56,0.1)] px-3 py-2.5 text-left font-semibold text-[0.66rem] uppercase tracking-[1px] text-[var(--primary-light)] border-b border-[var(--border)] ${
                  i === 0 ? 'rounded-tl-lg' : ''
                } ${i === content.headers.length - 1 ? 'rounded-tr-lg' : ''}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row, ri) => (
            <tr
              key={ri}
              className="group hover:bg-[rgba(26,92,56,0.04)]"
            >
              {content.headers.map((header, ci) => {
                const value = row[header] ?? ''
                const badge = detectBadge(value)
                return (
                  <td
                    key={ci}
                    className="px-3 py-2.5 border-b border-[var(--border)] text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors"
                  >
                    {badge ? (
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold ${
                          badgePatterns[badge.color] ?? ''
                        }`}
                      >
                        {badge.text}
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
