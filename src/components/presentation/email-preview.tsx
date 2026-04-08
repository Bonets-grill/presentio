'use client'

import { useState } from 'react'
import type { EmailPreviewContent } from '@/types/presentation'

interface EmailPreviewProps {
  content: EmailPreviewContent
}

const badgeColorMap: Record<string, string> = {
  green: 'bg-[rgba(34,197,94,0.15)] text-[var(--success)]',
  yellow: 'bg-[rgba(245,158,11,0.15)] text-[var(--warning)]',
  red: 'bg-[rgba(239,68,68,0.15)] text-[var(--danger)]',
  blue: 'bg-[rgba(59,130,246,0.15)] text-[var(--info)]',
  purple: 'bg-[rgba(168,85,247,0.15)] text-[#a855f7]',
  gold: 'bg-[rgba(212,168,67,0.15)] text-[var(--accent)]',
}

export function EmailPreview({ content }: EmailPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = content.emails[selectedIndex]

  if (!selected) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Email list */}
      <div>
        <h4 className="text-[0.9rem] mb-4 text-[var(--accent)]">
          Emails automaticos:
        </h4>
        <div className="flex flex-col gap-2">
          {content.emails.map((email, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`text-left bg-[var(--bg-card)] border rounded-[14px] px-4 py-3 cursor-pointer transition-all duration-200 ${
                i === selectedIndex
                  ? 'border-[rgba(26,92,56,0.4)]'
                  : 'border-[var(--border)] hover:border-[rgba(26,92,56,0.3)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.85rem] font-semibold text-[var(--text)]">
                  {email.label}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold ${
                    badgeColorMap[email.badgeColor] ?? ''
                  }`}
                >
                  {email.badge}
                </span>
              </div>
              <div className="text-[0.72rem] text-[var(--text-muted)] mt-1">
                {email.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden">
        <div className="px-[18px] py-3.5 border-b border-[var(--border)] bg-black/20">
          <div className="flex justify-between text-[0.78rem] py-0.5">
            <span className="text-[var(--text-muted)] w-[60px]">De:</span>
            <span className="text-[var(--text)] flex-1">{selected.from}</span>
          </div>
          <div className="flex justify-between text-[0.78rem] py-0.5">
            <span className="text-[var(--text-muted)] w-[60px]">Para:</span>
            <span className="text-[var(--text)] flex-1">{selected.to}</span>
          </div>
          <div className="flex justify-between text-[0.78rem] py-0.5">
            <span className="text-[var(--text-muted)] w-[60px]">Asunto:</span>
            <span className="text-[var(--text)] flex-1 font-semibold">{selected.subject}</span>
          </div>
        </div>
        <div
          className="p-[18px] text-[0.85rem] leading-[1.7] text-[var(--text-muted)]"
          dangerouslySetInnerHTML={{ __html: selected.bodyHtml }}
        />
      </div>
    </div>
  )
}
