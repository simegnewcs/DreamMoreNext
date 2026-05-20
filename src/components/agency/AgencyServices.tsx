"use client";

import { motion } from "framer-motion";
import {
  Code, Smartphone, Globe, Brain, Palette, Zap, TrendingUp, Shield,
} from "lucide-react";
import { SERVICES } from "@/lib/data";
import { useTheme } from "@/context/ThemeContext";

const iconMap: Record<string, React.ElementType> = {
  Code, Smartphone, Globe, Brain, Palette, Zap, TrendingUp, Shield,
};

export default function AgencyServices() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="services" className={`relative py-24 overflow-hidden ${isDark ? "bg-[#050508]" : "bg-gray-50"}`}>
      <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-25" : "opacity-5"}`} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">What We Do</span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Our <span className="gradient-text">Core Services</span>
          </h2>
          <p className={`max-w-2xl mx-auto ${isDark ? "text-white/50" : "text-gray-600"}`}>
            Full-spectrum digital services built for businesses that demand excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon] || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                id={service.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                className={`group rounded-2xl p-7 transition-all duration-300 relative overflow-hidden ${
                  isDark 
                    ? "glass hover:border-white/15" 
                    : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"
                }`}
              >
                {/* Hover glow */}
                {isDark && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at top left, ${service.color}08, transparent 70%)` }}
                  />
                )}

                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${service.color}12`,
                    border: `1px solid ${service.color}22`,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: service.color }} />
                </div>

                <h3 className={`relative font-bold text-lg mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{service.title}</h3>
                <p className={`relative text-sm leading-relaxed ${isDark ? "text-white/50" : "text-gray-600"}`}>{service.description}</p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
