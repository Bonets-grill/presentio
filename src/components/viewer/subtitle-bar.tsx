'use client'

interface SubtitleBarProps {
  text: string
  visible: boolean
}

export function SubtitleBar({ text, visible }: SubtitleBarProps) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[300] text-center px-5 py-4 pointer-events-none"
      style={{ background: 'linear-gradient(transparent, rgba(10,15,13,0.97) 40%)' }}
    >
      <div
        className="inline-flex items-center gap-2.5 px-7 py-3 rounded-[14px] max-w-[750px]"
        style={{
          background: 'rgba(17,26,21,0.95)',
          border: '1px solid rgba(45,138,86,0.3)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0 animate-pulse"
          style={{ background: '#22c55e' }}
        />
        <span className="text-[#e8ede9] text-[0.9rem] font-medium font-[Inter,sans-serif]">
          {text}
        </span>
      </div>
    </div>
  )
}
