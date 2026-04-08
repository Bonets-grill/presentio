'use client'

interface ProgressBarProps {
  progress: number // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="fixed left-0 right-0 z-[300] h-[3px]"
      style={{ top: 56, background: 'rgba(30,46,36,0.4)' }}
    >
      <div
        className="h-full rounded-r-sm transition-[width] duration-300 ease-linear"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          background: 'linear-gradient(90deg, var(--pres-primary, #2d8a56), var(--pres-accent, #d4a843))',
        }}
      />
    </div>
  )
}
