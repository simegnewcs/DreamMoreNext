"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const contactInfo = [
  { icon: Mail, label: "Email", value: "suport@dreammoredigitals.com", href: "mailto:suport@dreammoredigitals.com", color: "#00d4ff" },
  { icon: Phone, label: "Phone", value: "+251 993 132 122", href: "tel:+251993132122", color: "#7c3aed" },
  { icon: MessageCircle, label: "WhatsApp", value: "+251 993 132 122", href: "https://wa.me/251993132122", color: "#10b981" },
  { icon: Send, label: "Telegram", value: "@dreammoredigitals", href: "https://t.me/dreammoredigitals", color: "#00a9ff" },
  { icon: MapPin, label: "Location", value: "Bahirdar, Ethiopia", href: "#", color: "#f59e0b" },
];

export default function ContactClient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark && <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px]" />}
          <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-badge mb-4">Get In Touch</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
            Let&apos;s <span className="gradient-text">Start a Conversation</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
            Have a project in mind? Want to join the academy? Or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <h3 className={`text-lg font-bold mb-6 col-span-full ${isDark ? "text-white" : "text-gray-900"}`}>Contact Information</h3>
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <motion.a
                key={info.label}
                href={info.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex items-center gap-4 rounded-xl p-5 transition-all duration-200 group ${isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: info.color + (isDark ? "15" : "20"), border: `1px solid ${info.color}${isDark ? "25" : "40"}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: info.color }} />
                </div>
                <div>
                  <div className={`text-sm mb-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{info.label}</div>
                  <div className={`text-base font-medium transition-colors ${isDark ? "text-white group-hover:text-orange-400" : "text-gray-900 group-hover:text-orange-500"}`}>{info.value}</div>
                </div>
              </motion.a>
            );
          })}

          {/* Map placeholder */}
          <div className={`rounded-2xl overflow-hidden col-span-full ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
            <div className={`h-64 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-slate-800/60 to-slate-900/40" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
              <div className="text-center">
                <MapPin className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-white/15" : "text-gray-400"}`} />
                <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-500"}`}>Bole Road, Addis Ababa</p>
                <p className={`text-sm ${isDark ? "text-white/20" : "text-gray-400"}`}>Google Maps integration coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
