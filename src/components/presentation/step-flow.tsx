'use client'

import { useEffect, useState } from 'react'
import type { StepFlowContent } from '@/types/presentation'

interface StepFlowProps {
  content: StepFlowContent
}

export function StepFlow({ content }: StepFlowProps) {
  const [activeIndex, setActiveIndex] = useState(content.animated ? -1 : content.steps.length - 1)
  const color = content.color ?? 'var(--success)'

  useEffect(() => {
    if (!content.animated) return
    let i = 0
    const interval = setInterval(() => {
      setActiveIndex(i)
      i++
      if (i >= content.steps.length) clearInterval(interval)
    }, 600)
    return () => clearInterval(interval)
  }, [content.animated, content.steps.length])

  return (
    <div>
      {content.title && (
        <h4 className="text-[0.9rem] mb-4 text-[var(--accent)]">{content.title}</h4>
      )}
      <div className="flex flex-col">
        {content.steps.map((step, i) => {
          const isActive = i <= activeIndex
          const isLast = i === content.steps.length - 1
          return (
            <div
              key={i}
              className="grid gap-x-3.5 items-start transition-opacity duration-500"
              style={{
                gridTemplateColumns: '40px 3px 1fr',
                opacity: isActive ? 1 : 0.3,
              }}
            >
              {/* Dot */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[0.75rem]"
                style={{
                  background: `color-mix(in srgb, ${color} 15%, transparent)`,
                  color,
                }}
              >
                {i + 1}
              </div>

              {/* Line */}
              <div className="flex flex-col items-center">
                {!isLast && (
                  <div
                    className="w-[3px] flex-1 min-h-4 opacity-20"
                    style={{ background: color }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-[18px]">
                <div className="font-bold text-[0.9rem] mb-0.5">{step.title}</div>
                <div className="text-[0.8rem] text-[var(--text-muted)]">{step.description}</div>
                {step.detail && (
                  <div
                    className="mt-2 px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[0.78rem] text-[var(--text-muted)] border-l-[3px] border-l-[var(--primary-light)]"
                    dangerouslySetInnerHTML={{ __html: step.detail }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
