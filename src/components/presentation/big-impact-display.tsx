import type { BigImpactContent } from '@/types/presentation'

interface BigImpactDisplayProps {
  content: BigImpactContent
}

export function BigImpactDisplay({ content }: BigImpactDisplayProps) {
  return (
    <div>
      {/* Headline */}
      {content.headline && (
        <h3 className="text-[0.9rem] mb-4 text-[var(--accent)]">{content.headline}</h3>
      )}

      {/* Big result box */}
      <div
        className="rounded-[18px] p-10 text-center my-8 border-2 border-[var(--primary)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(26,92,56,0.15), rgba(212,168,67,0.08))',
        }}
      >
        <div
          className="text-[clamp(2.5rem,6vw,4rem)] font-black leading-none bg-clip-text"
          style={{
            background: 'linear-gradient(135deg, var(--success), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {content.value}
        </div>
        <div className="text-base text-[var(--text-muted)] mt-1.5">{content.subtitle}</div>

        {/* Breakdown grid */}
        {content.breakdownItems && content.breakdownItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {content.breakdownItems.map((item, i) => (
              <div key={i}>
                <h4 className="text-[1.6rem] font-extrabold text-[var(--accent)]">
                  {item.value}
                </h4>
                <p className="text-[0.78rem] text-[var(--text-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
