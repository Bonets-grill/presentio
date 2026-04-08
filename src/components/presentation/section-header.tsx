interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
}

export function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <div>
      {label && (
        <div className="text-[0.72rem] uppercase tracking-[3px] text-[var(--accent)] mb-2">
          {label}
        </div>
      )}
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold mb-3 leading-[1.15] text-[var(--text)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-[var(--text-muted)] max-w-[700px] mb-8">
          {subtitle}
        </p>
      )}
    </div>
  )
}
