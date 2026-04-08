import type { KPIGridContent } from '@/types/presentation'

interface KPIGridProps {
  content: KPIGridContent
}

const changeColorMap = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
} as const

export function KPIGrid({ content }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {content.items.map((item, i) => (
        <div
          key={i}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
        >
          <div className="text-[0.68rem] text-[var(--text-muted)] uppercase tracking-[0.5px] mb-1">
            {item.label}
          </div>
          <div
            className="text-[1.6rem] font-extrabold"
            style={{
              color: item.changeColor
                ? changeColorMap[item.changeColor]
                : 'var(--text)',
            }}
          >
            {item.prefix}
            {item.value}
            {item.suffix}
          </div>
          {item.change && (
            <div
              className="text-[0.7rem] mt-0.5"
              style={{
                color: item.changeColor
                  ? changeColorMap[item.changeColor]
                  : 'var(--text-muted)',
              }}
            >
              {item.change}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
