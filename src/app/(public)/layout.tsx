import '@/components/presentation/theme.css'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--pres-bg, #0a0f0d)' }}>
      {children}
    </div>
  )
}
