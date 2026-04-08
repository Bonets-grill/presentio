'use client'

import { useEffect, useState, useRef } from 'react'
import type { ChatSimulationContent } from '@/types/presentation'

interface ChatSimulationProps {
  content: ChatSimulationContent
}

export function ChatSimulation({ content }: ChatSimulationProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const messages = content.messages
    let i = 0

    function nextMessage() {
      if (i >= messages.length) return
      const msg = messages[i]

      if (msg.type === 'typing') {
        setShowTyping(true)
        setTimeout(() => {
          setShowTyping(false)
          i++
          nextMessage()
        }, msg.delay ?? 1500)
        return
      }

      setVisibleCount(i + 1)
      i++
      setTimeout(nextMessage, msg.delay ?? 1200)
    }

    const timeout = setTimeout(nextMessage, 500)
    return () => clearTimeout(timeout)
  }, [content.messages])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleCount, showTyping])

  const visibleMessages = content.messages
    .filter((m) => m.type !== 'typing')
    .slice(0, visibleCount)

  return (
    <div className="max-w-[420px] bg-[#0b141a] rounded-[14px] overflow-hidden border border-[#1e3a2f]">
      {/* Header */}
      <div className="bg-[#1f2c34] px-3.5 py-2.5 flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[0.8rem]"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          }}
        >
          {content.botAvatar}
        </div>
        <div>
          <div className="font-semibold text-[0.9rem]">{content.botName}</div>
          <div className="text-[0.65rem] text-[var(--success)]">en linea</div>
        </div>
      </div>

      {/* Chat */}
      <div
        ref={chatRef}
        className="p-3.5 flex flex-col gap-1.5 min-h-[200px] max-h-[400px] overflow-y-auto"
      >
        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[88%] px-2.5 py-[7px] text-[0.82rem] leading-relaxed animate-[fadeSlideIn_0.4s_ease_forwards] ${
              msg.type === 'customer'
                ? 'bg-[#1d3d2e] self-end rounded-lg rounded-tr-none'
                : 'bg-[#1f2c34] self-start rounded-lg rounded-tl-none'
            }`}
          >
            {msg.text}
            {msg.hasDetail && msg.detailHtml && (
              <div
                className="bg-[rgba(26,92,56,0.12)] border border-[rgba(26,92,56,0.25)] rounded-md p-2 mt-1.5 text-[0.75rem]"
                dangerouslySetInnerHTML={{ __html: msg.detailHtml }}
              />
            )}
          </div>
        ))}

        {showTyping && (
          <div className="bg-[#1f2c34] self-start rounded-lg rounded-tl-none px-3.5 py-2.5">
            <div className="inline-flex gap-[3px]">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-[typingBounce_1.4s_infinite]" />
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-[typingBounce_1.4s_infinite_0.2s]" />
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-[typingBounce_1.4s_infinite_0.4s]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
