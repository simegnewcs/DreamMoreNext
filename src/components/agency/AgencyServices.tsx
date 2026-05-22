"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code, Smartphone, Globe, Brain, Palette, Zap, TrendingUp, Shield, ChevronDown, CheckCircle2,
} from "lucide-react";
import { SERVICES } from "@/lib/data";
import { useTheme } from "@/context/ThemeContext";

const iconMap: Record<string, React.ElementType> = {
  Code, Smartphone, Globe, Brain, Palette, Zap, TrendingUp, Shield,
};

export default function AgencyServices() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section id="services" className={`relative py-24 overflow-hidden ${isDark ? "bg-[#050508]" : "bg-gray-50"}`}>
      <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-25" : "opacity-5"}`} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="space-y-0">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon] || Code;
            const isOpen = openId === service.id;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                id={service.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                className={`border-b transition-colors ${
                  isDark ? "border-white/8" : "border-gray-200"
                } ${isOpen ? (isDark ? "bg-white/3" : "bg-orange-50/60") : ""}`}
              >
                {/* Row header */}
                <div className="flex items-center gap-5 py-6 px-2">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${service.color}15`, border: `1px solid ${service.color}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: service.color }} strokeWidth={1.6} />
                  </div>

                  {/* Title + desc */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                      {service.title}
                    </h3>
                    <p className={`hidden sm:block text-sm mt-0.5 leading-relaxed ${isDark ? "text-white/45" : "text-gray-500"}`}>
                      {service.description}
                    </p>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : service.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-all duration-200 ${
                      isOpen
                        ? "text-white"
                        : isDark
                          ? "text-white/60 hover:text-white border border-white/10 hover:border-white/20"
                          : "text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
                    }`}
                    style={isOpen ? { background: service.color } : {}}
                  >
                    View Full Details
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Expandable details */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 px-2 pl-16">
                        <p className={`sm:hidden text-sm mb-4 leading-relaxed ${isDark ? "text-white/55" : "text-gray-500"}`}>
                          {service.description}
                        </p>
                        <ul className="space-y-2.5">
                          {service.details.map((point, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.07 }}
                              className="flex items-start gap-2.5"
                            >
                              <CheckCircle2
                                className="w-4 h-4 flex-shrink-0 mt-0.5"
                                style={{ color: service.color }}
                              />
                              <span className={`text-sm ${isDark ? "text-white/65" : "text-gray-600"}`}>
                                {point}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
