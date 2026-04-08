'use client'

import { useEffect, useState } from 'react'
import type { ProgressBarsContent } from '@/types/presentation'

interface ProgressBarsProps {
  content: ProgressBarsContent
}

export function ProgressBars({ content }: ProgressBarsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {content.bars.map((bar, i) => {
        const pct = Math.min((bar.value / bar.maxValue) * 100, 100)
        const color = bar.color ?? 'var(--success)'

        return (
          <div key={i}>
            <div className="flex justify-between text-[0.78rem] mb-1">
              <span className="text-[var(--text)]">{bar.label}</span>
              <span className="font-semibold" style={{ color }}>
                {bar.displayValue}
              </span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded overflow-hidden">
              <div
                className="h-full rounded transition-[width] duration-[1.5s] ease-out"
                style={{
                  width: mounted ? `${pct}%` : '0%',
                  background: color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
