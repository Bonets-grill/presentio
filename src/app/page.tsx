"use client";

import { useEffect } from "react";

/* ─── color tokens (landing-specific) ─── */
const C = {
  bg: "#0a0f0d",
  bgAlt: "#0d1410",
  card: "#111916",
  cardBorder: "#1a2e23",
  green: "#1a5c38",
  greenLight: "#22c55e",
  gold: "#d4a843",
  goldLight: "#e8c96a",
  text: "#e4e4e7",
  muted: "#9ca3af",
  white: "#ffffff",
};

/* ─── SVG Icons (inline to keep single-file) ─── */
function IconSparkles({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function IconMic({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  );
}

function IconLink({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  );
}

function IconGlobe({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.555" />
    </svg>
  );
}

function IconChart({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function IconPalette({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.88 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>
  );
}

function IconCheck({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconX({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════ */

export default function HomePage() {
  useScrollReveal();

  return (
    <div style={{ background: C.bg }} className="text-[#e4e4e7] overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/5" style={{ background: "rgba(10,15,13,0.85)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span style={{ color: C.greenLight }}>P</span>resentio
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: C.muted }}>
            <a href="#how" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden sm:inline-block text-sm hover:text-white transition-colors" style={{ color: C.muted }}>
              Iniciar sesión
            </a>
            <a
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all hover:brightness-110"
              style={{ background: C.green, color: C.white }}
            >
              Empieza gratis
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: C.green }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]" style={{ background: C.gold }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-8" style={{ borderColor: C.cardBorder, color: C.gold, background: "rgba(212,168,67,0.08)" }}>
            <IconSparkles className="w-3.5 h-3.5" />
            Potenciado por Inteligencia Artificial
          </div>

          <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Presentaciones{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${C.greenLight}, ${C.gold})` }}>
              interactivas
            </span>
            <br />
            con voz IA
          </h1>

          <p className="animate-fade-in-up stagger-1 text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: C.muted }}>
            Crea presentaciones que hablan por ti. Contenido generado por IA,
            narración con voz natural, sincronización perfecta.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="/register"
              className="group px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:brightness-110 animate-pulse-glow"
              style={{ background: C.green, color: C.white }}
            >
              Empieza gratis
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
            <a
              href="#demo"
              className="px-8 py-3.5 rounded-xl text-base font-semibold border transition-all hover:bg-white/5"
              style={{ borderColor: C.cardBorder, color: C.text }}
            >
              Ver demo
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up stagger-3 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "30+", label: "voces disponibles" },
              { value: "6", label: "idiomas" },
              { value: "$1.50", label: "por presentación" },
              { value: "5 min", label: "setup" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: C.greenLight }}>
                  {s.value}
                </div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${C.bgAlt} 30%, ${C.bgAlt} 70%, transparent)` }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: C.gold }}>
              Cómo funciona
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              De idea a presentación en{" "}
              <span style={{ color: C.greenLight }}>3 pasos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe tu producto",
                desc: "Rellena un formulario simple con la información clave. La IA hace el resto.",
                icon: <IconSparkles className="w-7 h-7" />,
              },
              {
                step: "02",
                title: "La IA crea todo",
                desc: "Contenido, datos, gráficas, guión de voz. Todo generado en segundos.",
                icon: <IconMic className="w-7 h-7" />,
              },
              {
                step: "03",
                title: "Comparte y vende",
                desc: "Un link. Voz guiada. Analytics en tiempo real. Listo para compartir.",
                icon: <IconLink className="w-7 h-7" />,
              },
            ].map((item, i) => (
              <div key={i} className={`reveal stagger-${i + 1} relative group`}>
                <div
                  className="rounded-2xl p-8 border transition-all duration-300 hover:border-[#1a5c38]/60"
                  style={{ background: C.card, borderColor: C.cardBorder }}
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                    style={{ background: `${C.green}22`, color: C.greenLight }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-xs font-mono mb-2" style={{ color: C.gold }}>
                    PASO {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {item.desc}
                  </p>
                </div>
                {/* Connector line (hidden on last + mobile) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed" style={{ borderColor: C.cardBorder }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: C.gold }}>
              Funciones
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Todo lo que necesitas para{" "}
              <span style={{ color: C.greenLight }}>vender mejor</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconSparkles className="w-6 h-6" />, title: "IA genera tu contenido", desc: "Describe tu producto y la IA crea una presentación completa con datos, gráficas y narración." },
              { icon: <IconMic className="w-6 h-6" />, title: "Voz natural sincronizada", desc: "Narración con voz humana que guía al espectador sección por sección, con sincronización perfecta." },
              { icon: <IconLink className="w-6 h-6" />, title: "Comparte con un link", desc: "Publica y comparte tu presentación con un enlace único. Sin descargas, sin instalaciones." },
              { icon: <IconGlobe className="w-6 h-6" />, title: "Multilenguaje (6 idiomas)", desc: "Genera presentaciones en español, inglés, francés, alemán, portugués e italiano automáticamente." },
              { icon: <IconChart className="w-6 h-6" />, title: "Analytics en tiempo real", desc: "Sabe quién ve tu presentación, cuánto tiempo y qué secciones generan más interés." },
              { icon: <IconPalette className="w-6 h-6" />, title: "Temas personalizables", desc: "Elige entre temas oscuros, claros o corporativos. Adapta colores a tu marca." },
            ].map((f, i) => (
              <div
                key={i}
                className={`reveal stagger-${(i % 3) + 1} rounded-2xl p-6 border transition-all duration-300 hover:border-[#1a5c38]/60 hover:-translate-y-1`}
                style={{ background: C.card, borderColor: C.cardBorder }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                  style={{ background: `${C.green}22`, color: C.greenLight }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO PREVIEW ── */}
      <section id="demo" className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${C.bgAlt} 30%, ${C.bgAlt} 70%, transparent)` }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="reveal text-center mb-12">
            <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: C.gold }}>
              Demo
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Así se ve tu presentación
            </h2>
          </div>

          {/* Mock presentation */}
          <div className="reveal rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.cardBorder }}>
            {/* Mock nav bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: C.cardBorder }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs px-3 py-1 rounded-md" style={{ background: C.bg, color: C.muted }}>
                  presentio.app/p/acme-corp
                </span>
              </div>
            </div>

            {/* Mock content */}
            <div className="p-8 sm:p-12">
              {/* Mock hero */}
              <div className="text-center mb-10">
                <div className="text-xs font-mono mb-3" style={{ color: C.gold }}>ACME CORP</div>
                <h3
                  className="text-2xl sm:text-4xl font-bold mb-3 bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.greenLight}, ${C.gold})` }}
                >
                  La plataforma que transforma tu negocio
                </h3>
                <p className="text-sm" style={{ color: C.muted }}>
                  Automatiza, escala y crece con inteligencia artificial
                </p>
              </div>

              {/* Mock KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Clientes activos", value: "2,847" },
                  { label: "MRR", value: "$142K" },
                  { label: "Crecimiento", value: "+34%" },
                  { label: "NPS", value: "72" },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 text-center border"
                    style={{ background: C.bg, borderColor: C.cardBorder }}
                  >
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: C.greenLight }}>
                      {kpi.value}
                    </div>
                    <div className="text-xs mt-1" style={{ color: C.muted }}>
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock chart bars */}
              <div className="flex items-end justify-center gap-2 h-24">
                {[40, 55, 35, 70, 60, 80, 75, 90, 65, 85, 95, 88].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-t-sm flex-1 max-w-[32px] transition-all"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, ${C.green}, ${C.greenLight})`,
                      opacity: 0.6 + i * 0.03,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Voice bar */}
            <div className="flex items-center gap-3 px-6 py-3 border-t" style={{ borderColor: C.cardBorder, background: C.bg }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.green }}>
                <IconMic className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: C.cardBorder }}>
                  <div className="h-full rounded-full w-[65%]" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.greenLight})` }} />
                </div>
              </div>
              <span className="text-xs" style={{ color: C.muted }}>2:14 / 3:28</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: C.gold }}>
              Precios
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Simple y transparente
            </h2>
            <p className="mt-4 text-sm" style={{ color: C.muted }}>
              Empieza gratis. Mejora cuando lo necesites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "para siempre",
                desc: "Ideal para probar Presentio.",
                features: [
                  { text: "3 presentaciones/mes", ok: true },
                  { text: "5 min de voz/mes", ok: true },
                  { text: "Temas básicos", ok: true },
                  { text: "Analytics básicas", ok: true },
                  { text: "Marca Presentio", ok: true },
                  { text: "Voces premium", ok: false },
                  { text: "Marca personalizada", ok: false },
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "$29",
                period: "/mes",
                desc: "Para profesionales y freelancers.",
                features: [
                  { text: "Presentaciones ilimitadas", ok: true },
                  { text: "60 min de voz/mes", ok: true },
                  { text: "Todos los temas", ok: true },
                  { text: "Analytics avanzadas", ok: true },
                  { text: "Sin marca Presentio", ok: true },
                  { text: "Voces premium (30+)", ok: true },
                  { text: "Exportar PDF", ok: true },
                ],
                popular: true,
              },
              {
                name: "Team",
                price: "$49",
                period: "/usuario/mes",
                desc: "Para equipos de ventas.",
                features: [
                  { text: "Todo en Pro", ok: true },
                  { text: "Espacio de trabajo compartido", ok: true },
                  { text: "Roles y permisos", ok: true },
                  { text: "SSO / SAML", ok: true },
                  { text: "API access", ok: true },
                  { text: "Soporte prioritario", ok: true },
                  { text: "Onboarding dedicado", ok: true },
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`reveal stagger-${i + 1} relative rounded-2xl p-8 border transition-all duration-300 ${plan.popular ? "md:-translate-y-2" : ""}`}
                style={{
                  background: C.card,
                  borderColor: plan.popular ? C.green : C.cardBorder,
                  boxShadow: plan.popular ? `0 0 40px ${C.green}30, 0 0 80px ${C.green}10` : "none",
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: C.green, color: C.white }}
                  >
                    Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm mb-4" style={{ color: C.muted }}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: plan.popular ? C.greenLight : C.text }}>
                      {plan.price}
                    </span>
                    <span className="text-sm" style={{ color: C.muted }}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      {f.ok ? (
                        <IconCheck className="w-4 h-4 flex-shrink-0" style={{ color: C.greenLight }} />
                      ) : (
                        <IconX className="w-4 h-4 flex-shrink-0" style={{ color: "#4b5563" }} />
                      )}
                      <span style={{ color: f.ok ? C.text : "#6b7280" }}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/register"
                  className="block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{
                    background: plan.popular ? C.green : "transparent",
                    color: plan.popular ? C.white : C.text,
                    border: plan.popular ? "none" : `1px solid ${C.cardBorder}`,
                  }}
                >
                  {plan.price === "$0" ? "Empieza gratis" : "Comenzar"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${C.bgAlt} 30%, ${C.bgAlt} 70%, transparent)` }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: C.gold }}>
              Testimonios
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Usado por equipos de ventas en toda{" "}
              <span style={{ color: C.greenLight }}>Europa y LATAM</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Presentio nos ahorra 4 horas por semana en preparar pitch decks. La voz guiada es lo que cierra la venta.",
                name: "Marta Vidal",
                company: "SalesForward",
                role: "Head of Sales",
              },
              {
                quote: "Lo mejor es el multilenguaje. Enviamos la misma presentación en 3 idiomas a clientes en toda Europa sin esfuerzo.",
                name: "Alejandro Ruiz",
                company: "Nextera Digital",
                role: "CEO & Founder",
              },
              {
                quote: "La IA genera contenido que realmente suena profesional. Nuestros clientes creen que tenemos un equipo de diseño interno.",
                name: "Claudia Santos",
                company: "Grupo Fintech MX",
                role: "VP Marketing",
              },
            ].map((t, i) => (
              <div
                key={i}
                className={`reveal stagger-${i + 1} rounded-2xl p-6 border`}
                style={{ background: C.card, borderColor: C.cardBorder }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-4 h-4" fill={C.gold} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: C.muted }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs" style={{ color: C.muted }}>
                    {t.role} &middot; {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="reveal">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              ¿Listo para crear tu primera{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.greenLight}, ${C.gold})` }}
              >
                presentación
              </span>
              ?
            </h2>
            <p className="text-lg mb-10" style={{ color: C.muted }}>
              Crea una presentación profesional con voz IA en menos de 5 minutos.
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold transition-all hover:brightness-110 animate-pulse-glow"
              style={{ background: C.green, color: C.white }}
            >
              Empieza gratis
              <span>&rarr;</span>
            </a>
            <p className="mt-4 text-sm" style={{ color: C.muted }}>
              No necesitas tarjeta de crédito
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-16" style={{ borderColor: C.cardBorder }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="text-xl font-bold mb-4">
                <span style={{ color: C.greenLight }}>P</span>resentio
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                Presentaciones interactivas con voz IA. Crea, comparte y convierte.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                <li><a href="#how" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-3">
                {/* Twitter/X */}
                <a href="#" className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-white/5" style={{ borderColor: C.cardBorder, color: C.muted }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-white/5" style={{ borderColor: C.cardBorder, color: C.muted }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-white/5" style={{ borderColor: C.cardBorder, color: C.muted }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: C.cardBorder }}>
            <p className="text-xs" style={{ color: C.muted }}>
              &copy; 2026 Presentio. Todos los derechos reservados.
            </p>
            <p className="text-xs" style={{ color: C.muted }}>
              Hecho con IA en Barcelona
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
