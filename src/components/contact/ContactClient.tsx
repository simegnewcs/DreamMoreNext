"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, User, FileText, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const contactInfo = [
  { 
    icon: Mail, 
    label: "Email", 
    value: "suport@dreammoredigitals.com", 
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=suport@dreammoredigitals.com", 
    color: "#00d4ff" 
  },
  { 
    icon: Phone, 
    label: "Phone", 
    value: "+251 993 132 122", 
    href: "tel:+251993132122", 
    color: "#7c3aed" 
  },
  { 
    icon: MessageCircle, 
    label: "WhatsApp", 
    value: "+251 993 132 122", 
    href: "https://wa.me/251993132122", 
    color: "#10b981" 
  },
  { 
    icon: Send, 
    label: "Telegram", 
    value: "@Dreammore21", 
    href: "https://t.me/Dreammore21", 
    color: "#00a9ff" 
  },
  { 
    icon: MapPin, 
    label: "Location", 
    value: "Bahirdar, Ethiopia", 
    href: "https://maps.google.com/?q=Bahirdar,Ethiopia", 
    color: "#f59e0b" 
  },
];

export default function ContactClient() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const isDark = theme === "dark";
  const [fullName, setFullName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          subject,
          message,
          userEmail: user?.email || "",
          isLoggedIn: !!user,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to send your message right now.");
      }

      setStatus({ type: "success", message: result.message || "Your message has been sent successfully." });
      setFullName(user?.name || "");
      setSubject("");
      setMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send your message right now.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
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
          <span className="section-badge mb-4">{t("contact.heroBadge")}</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("contact.heroTitle")}
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
            {t("contact.heroDescription")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{t("contact.infoTitle")}</h3>
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("#") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Forcefully intercept the click event if it's the custom web link
                    if (info.href.startsWith("http")) {
                      e.preventDefault();
                      window.open(info.href, "_blank", "noopener,noreferrer");
                    }
                  }}
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


          </div>

          {/* Contact form */}
          <div className={`rounded-2xl p-8 ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{t("contact.formTitle")}</h3>
                <p className={`text-sm mt-1 ${isDark ? "text-white/60" : "text-gray-600"}`}>
                  {user ? `${t("contact.loggedInAs")} ${user.name || user.email}` : t("contact.loginHint")}
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder={t("contact.fullNamePlaceholder")}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className={`w-full rounded-xl border px-10 py-3 text-sm outline-none transition ${isDark ? "border-white/10 bg-white/5 text-white placeholder:text-white/40" : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"}`}
                />
              </div>

              <div className="relative">
                <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder={t("contact.subjectPlaceholder")}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                  className={`w-full rounded-xl border px-10 py-3 text-sm outline-none transition ${isDark ? "border-white/10 bg-white/5 text-white placeholder:text-white/40" : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"}`}
                />
              </div>

              <div className="relative">
                <MessageSquareText className={`absolute left-3 top-4 w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                <textarea
                  placeholder={t("contact.messagePlaceholder")}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  rows={6}
                  className={`w-full rounded-xl border px-10 py-3 text-sm outline-none transition resize-none ${isDark ? "border-white/10 bg-white/5 text-white placeholder:text-white/40" : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? t("contact.sending") : t("contact.send")}
              </button>

              {status.message ? (
                <div className={`rounded-xl border px-4 py-3 text-sm ${status.type === "success" ? (isDark ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700") : (isDark ? "border-rose-400/30 bg-rose-500/10 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700")}`}>
                  {status.message}
                </div>
              ) : null}
            </form>

            <div className={`mt-6 rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
              <p className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{t("contact.businessHours")}</p>
              <div className="space-y-2">
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <span className={`text-xs font-medium ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>{t("contact.mondayFriday")}</span>
                  <span className={`text-xs font-semibold ${isDark ? "text-emerald-100" : "text-emerald-800"}`}>2:00 AM - 11:00 AM</span>
                </div>
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <span className={`text-xs font-medium ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>{t("contact.saturday")}</span>
                  <span className={`text-xs font-semibold ${isDark ? "text-emerald-100" : "text-emerald-800"}`}>4:00 AM - 10:00 AM</span>
                </div>
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${isDark ? "bg-rose-500/10" : "bg-rose-50"}`}>
                  <span className={`text-xs font-medium ${isDark ? "text-rose-200" : "text-rose-700"}`}>{t("contact.sunday")}</span>
                  <span className={`text-xs font-semibold ${isDark ? "text-rose-100" : "text-rose-800"}`}>{t("contact.closed")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className={`rounded-3xl overflow-hidden border ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white shadow-sm"}`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15633.689209243024!2d37.36822042324327!3d11.593211563643107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1644d18394e94c53%3A0x8d1e38bd4dc4f170!2sSignal%20mall!5e0!3m2!1sen!2set!4v1781660032585!5m2!1sen!2set"
              width="100%"
              height="520"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DreamMore Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}