"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, MessageCircle } from "lucide-react";
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
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Contact Information</h3>
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-4 rounded-xl p-4 transition-all duration-200 group ${isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: info.color + (isDark ? "15" : "20"), border: `1px solid ${info.color}${isDark ? "25" : "40"}` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: info.color }} />
                  </div>
                  <div>
                    <div className={`text-xs mb-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>{info.label}</div>
                    <div className={`text-sm font-medium transition-colors ${isDark ? "text-white group-hover:text-orange-400" : "text-gray-900 group-hover:text-orange-500"}`}>{info.value}</div>
                  </div>
                </motion.a>
              );
            })}

            {/* Map placeholder */}
            <div className={`rounded-2xl overflow-hidden mt-6 ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
              <div className={`h-48 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-slate-800/60 to-slate-900/40" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                <div className="text-center">
                  <MapPin className={`w-10 h-10 mx-auto mb-2 ${isDark ? "text-white/15" : "text-gray-400"}`} />
                  <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-500"}`}>Bole Road, Addis Ababa</p>
                  <p className={`text-xs ${isDark ? "text-white/20" : "text-gray-400"}`}>Google Maps integration coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}
              >
                <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Message Sent!</h3>
                <p className={`text-sm ${isDark ? "text-white/55" : "text-gray-600"}`}>We&apos;ll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className={`rounded-2xl p-8 space-y-5 ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/65" : "text-gray-700"}`}>Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Full name"
                      className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400/50 transition-colors ${
                        isDark 
                          ? "bg-white/5 border border-white/10 text-white placeholder-white/30" 
                          : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/65" : "text-gray-600"}`}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400/50 transition-colors ${
                        isDark 
                          ? "bg-white/5 border border-white/10 text-white placeholder-white/30" 
                          : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/65" : "text-gray-600"}`}>Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400/50 transition-colors ${
                      isDark 
                        ? "bg-white/5 border border-white/10 text-white placeholder-white/30" 
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/65" : "text-gray-600"}`}>Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project, question, or idea..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400/50 transition-colors resize-none ${
                      isDark 
                        ? "bg-white/5 border border-white/10 text-white placeholder-white/30" 
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
