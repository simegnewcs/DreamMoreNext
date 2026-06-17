"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Contact Information</h3>
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

          {/* Additional info */}
          <div className={`rounded-2xl p-8 ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Get in Touch</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-gray-600"}`}>
              We&apos;re here to help! Reach out to us through any of the contact methods listed on the left. Whether you have questions about our courses, need technical support, or want to discuss a project, our team is ready to assist you.
            </p>
            <div className={`mt-6 rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
              <p className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Business Hours</p>
              <div className="space-y-2">
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <span className={`text-xs font-medium ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>Monday - Friday</span>
                  <span className={`text-xs font-semibold ${isDark ? "text-emerald-100" : "text-emerald-800"}`}>2:00 AM - 11:00 AM</span>
                </div>
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <span className={`text-xs font-medium ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>Saturday</span>
                  <span className={`text-xs font-semibold ${isDark ? "text-emerald-100" : "text-emerald-800"}`}>4:00 AM - 10:00 AM</span>
                </div>
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${isDark ? "bg-rose-500/10" : "bg-rose-50"}`}>
                  <span className={`text-xs font-medium ${isDark ? "text-rose-200" : "text-rose-700"}`}>Sunday</span>
                  <span className={`text-xs font-semibold ${isDark ? "text-rose-100" : "text-rose-800"}`}>Closed</span>
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