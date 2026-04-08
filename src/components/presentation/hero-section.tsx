import type { HeroContent } from '@/types/presentation'

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-76px)]">
      {/* Glow background */}
      <div
        className="absolute -top-[30%] -left-[30%] w-[160%] h-[160%] animate-[heroGlow_8s_ease-in-out_infinite_alternate] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 35% 50%, rgba(26,92,56,0.12) 0%, transparent 60%), radial-gradient(ellipse at 65% 50%, rgba(212,168,67,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Badge */}
      {content.badge && (
        <div className="relative z-10 inline-flex items-center gap-2 px-[18px] py-1.5 bg-[rgba(26,92,56,0.2)] border border-[rgba(26,92,56,0.4)] rounded-full text-[0.8rem] text-[var(--primary-light)] mb-6">
          <span className="w-[7px] h-[7px] bg-[var(--success)] rounded-full animate-pulse" />
          {content.badge}
        </div>
      )}

      {/* Company Name */}
      <div className="relative z-10 text-[1.1rem] tracking-[5px] uppercase text-[var(--accent)] font-light mb-3">
        {content.companyName}
      </div>

      {/* Headline */}
      <h1
        className="relative z-10 text-[clamp(3rem,7vw,5rem)] font-black leading-[1.05] mb-5 bg-clip-text"
        style={{
          background: 'linear-gradient(135deg, #fff, var(--primary-light), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {content.headline}
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 text-[1.15rem] text-[var(--text-muted)] max-w-[600px] mb-8">
        {content.subheadline}
      </p>

      {/* CTA */}
      <button
        className="relative z-10 inline-flex items-center justify-center px-8 py-3.5 text-[0.95rem] font-bold text-white rounded-xl border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          boxShadow: '0 4px 20px rgba(26,92,56,0.3)',
        }}
      >
        {content.ctaText}
      </button>

      {/* Stats */}
      {content.stats && content.stats.length > 0 && (
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-[800px] w-full">
          {content.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-[2.2rem] font-extrabold text-[var(--accent)]">
                {stat.value}
              </div>
              <div className="text-[0.72rem] text-[var(--text-muted)] uppercase tracking-[1px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
