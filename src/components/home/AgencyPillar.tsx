"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Palette, TrendingUp, Layers, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const services = [
  { icon: Code2,       title: "Software Development", desc: "Scalable Web & Mobile Apps." },
  { icon: Palette,     title: "Brand Identity",        desc: "Visual storytelling & strategy." },
  { icon: TrendingUp,  title: "Digital Marketing",     desc: "SEO and Social Growth." },
  { icon: Layers,      title: "UI/UX Design",          desc: "User-centric experiences." },
];

const stats = [
  { value: "50+",  label: "Projects Delivered" },
  { value: "4.9★", label: "Client Rating" },
  { value: "3x",   label: "Avg. ROI Uplift" },
];

const clients = ["Hella Coffee", "EthioHealth", "AgroConnect", "SafeCity AI", "BankDash", "Addis Brand Co.", "Urban Bites", "StrLink"];

export default function AgencyPillar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: isDark ? "#0b0a1a" : "#f8f9fa" }}
    >
      {/* ── Orange top accent bar ── */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #f47822, transparent)" }} />

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full blur-[180px]"
          style={{ background: "rgba(244,120,34,0.05)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full blur-[150px]"
          style={{ background: "rgba(244,120,34,0.03)" }} />
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-8" : "opacity-4"}`} />
      </div>

      {/* ════════ MAIN TWO-COL BLOCK ════════ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT — Copy & services ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            {/* eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px" style={{ background: "#f47822" }} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#f47822" }}>
                The Agency
              </span>
            </div>

            {/* headline */}
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.0] tracking-tight mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              We Build<br />
              <span style={{ color: "#f47822" }}>World-Class</span><br />
              Digital Products.
            </h2>

            <p className={`text-base leading-relaxed mb-10 max-w-md ${isDark ? "text-white/50" : "text-gray-600"}`}>
              From enterprise software to AI-powered platforms — DreamMore delivers
              production-ready solutions that perform at global scale.
            </p>

            {/* service list */}
            <div className="space-y-4 mb-10">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-4 group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110"
                      style={{ background: "rgba(244,120,34,0.1)", border: "1px solid rgba(244,120,34,0.2)" }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: "#f47822" }} strokeWidth={1.6} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{s.title}</p>
                      <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              href="/agency"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest text-white rounded-sm transition-all hover:brightness-110 active:scale-95"
              style={{ background: "#f47822" }}
            >
              View Our Work
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* ── RIGHT — Device mockup stack ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            {/* glow behind */}
            <div
              className="absolute w-72 h-72 rounded-full blur-[80px] pointer-events-none"
              style={{ background: "rgba(244,120,34,0.08)" }}
            />

            <div className="relative w-full max-w-sm">

              {/* ── Background card (dashboard) ── */}
              <div
                className="absolute -bottom-4 -right-4 w-[85%] rounded-2xl overflow-hidden shadow-xl opacity-60"
                style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#13122a" }}
              >
                <div className="h-5 flex items-center px-3 gap-1" style={{ background: "#1e1c38" }}>
                  <div className="text-[7px] text-white/20 font-mono">analytics.dashboard</div>
                </div>
                <div className="p-3">
                  <div className="flex gap-1 items-end h-10">
                    {[35,55,42,70,48,82,60,76,44,90].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm"
                        style={{ height:`${h}%`, background: i===9 ? "#f47822" : i%2===0 ? "rgba(244,120,34,0.35)" : "rgba(244,120,34,0.15)" }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {[["ETB 2.4M","Revenue"],["18","Live"],["50+","Clients"]].map(([v,l])=>(
                      <div key={l} className="rounded p-1 text-center" style={{ background:"rgba(255,255,255,0.04)" }}>
                        <div className="text-[10px] font-black" style={{color:"#f47822"}}>{v}</div>
                        <div className="text-[7px] text-white/25">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Main MacBook card ── */}
              <div
                className="relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid rgba(244,120,34,0.18)", background: "#13122a", boxShadow: "0 24px 80px rgba(244,120,34,0.12)" }}
              >
                {/* title bar */}
                <div className="h-7 flex items-center px-4 gap-1.5" style={{ background: "#1e1c38" }}>
                  {["#ff5f57","#ffbd2e","#28c940"].map(c=>(
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />
                  ))}
                  <span className="text-[9px] font-mono text-white/20 ml-2 flex-1">dreammore.et/dashboard</span>
                  <div className="text-[8px] px-2 py-0.5 rounded-full font-bold text-white" style={{background:"rgba(244,120,34,0.3)"}}>LIVE</div>
                </div>

                {/* screen content */}
                <div className="p-5 space-y-4" style={{ background: "linear-gradient(160deg,#15142a 0%,#1a1837 100%)" }}>
                  {/* nav */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white tracking-widest">DREAMMORE</span>
                    <div className="flex gap-3">
                      {["Services","Portfolio","Contact"].map(n=>(
                        <span key={n} className="text-[9px] text-white/30">{n}</span>
                      ))}
                    </div>
                  </div>

                  {/* hero area */}
                  <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(244,120,34,0.1), rgba(244,120,34,0.03))", border: "1px solid rgba(244,120,34,0.12)" }}>
                    <p className="text-[9px] text-white/40 mb-1 tracking-wider">DIGITAL AGENCY</p>
                    <p className="text-sm font-black text-white leading-tight mb-2">We Build<br/>Digital Products.</p>
                    <div className="flex gap-2">
                      <div className="h-6 px-3 rounded text-[8px] font-bold flex items-center text-white" style={{ background: "#f47822" }}>Hire Us</div>
                      <div className="h-6 px-3 rounded text-[8px] flex items-center text-white/40" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Portfolio</div>
                    </div>
                  </div>

                  {/* project rows */}
                  <div className="space-y-2">
                    {[
                      { name: "EthioHealth Platform", pct: 100, done: true },
                      { name: "AgroConnect App",      pct: 68,  done: false },
                      { name: "SafeCity AI",          pct: 85,  done: false },
                    ].map(p => (
                      <div key={p.name} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: p.done ? "#10b981" : "#f47822" }} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[9px] text-white/50">{p.name}</span>
                            <span className="text-[9px] font-bold" style={{ color: p.done ? "#10b981" : "#f47822" }}>{p.pct}%</span>
                          </div>
                          <div className="h-0.5 rounded-full bg-white/8">
                            <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.done ? "#10b981" : "#f47822" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Floating phone (right side) ── */}
              <div
                className="absolute -right-8 top-8 z-20 w-[80px] rounded-[18px] overflow-hidden shadow-2xl"
                style={{ border: "1px solid rgba(244,120,34,0.25)", background: "#13122a" }}
              >
                <div className="h-5 flex items-center justify-center" style={{ background: "#1e1c38" }}>
                  <div className="w-8 h-1.5 rounded-full bg-white/15" />
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="h-12 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(244,120,34,0.25), rgba(244,120,34,0.06))" }} />
                  {[75,55,90].map((w,i)=>(
                    <div key={i} className="h-1 rounded-full bg-white/10" style={{width:`${w}%`}} />
                  ))}
                  <div className="h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(244,120,34,0.15)" }}>
                    <span className="text-[7px] font-bold" style={{ color: "#f47822" }}>DreamMore</span>
                  </div>
                </div>
                <div className="h-3 flex items-center justify-center">
                  <div className="w-5 h-0.5 rounded-full bg-white/20" />
                </div>
              </div>

              {/* ── Floating stat pill ── */}
              <div
                className="absolute -left-6 bottom-12 z-20 rounded-xl px-3 py-2 shadow-lg"
                style={{ background: "#1e1c38", border: "1px solid rgba(244,120,34,0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white/80">50+ Projects Live</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════ STATS STRIP ════════ */}
      <div
        className="relative border-t border-b"
        style={{ borderColor: "rgba(244,120,34,0.1)", background: isDark ? "rgba(244,120,34,0.03)" : "rgba(244,120,34,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color: "#f47822" }}>{s.value}</div>
                <div className={`text-xs uppercase tracking-widest ${isDark ? "text-white/40" : "text-gray-500"}`}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ 4-COL SERVICES STRIP ════════ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(244,120,34,0.15)", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(244,120,34,0.08)" }}>
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group flex flex-col items-start gap-3 p-8 transition-all duration-300"
                style={{ background: isDark ? "#0b0a1a" : "#ffffff" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{ background: "rgba(244,120,34,0.1)", border: "1px solid rgba(244,120,34,0.18)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#f47822" }} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className={`text-sm font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{s.title}</h4>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-white/40" : "text-gray-500"}`}>{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ════════ TRUSTED BY MARQUEE ════════ */}
      <div
        className="relative border-t py-8 overflow-hidden"
        style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(244,120,34,0.15)" }}
      >
        <p className={`text-center text-[10px] font-bold tracking-[0.28em] uppercase mb-6 ${isDark ? "text-white/25" : "text-gray-400"}`}>
          Trusted by forward-thinking brands
        </p>
        {/* marquee */}
        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center flex-shrink-0 whitespace-nowrap pr-12"
          >
            {[...clients, ...clients].map((name, i) => (
              <span
                key={i}
                className={`text-sm font-bold tracking-wider transition-colors cursor-default ${isDark ? "text-white/25 hover:text-white/50" : "text-gray-400 hover:text-gray-600"}`}
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
