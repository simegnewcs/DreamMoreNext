"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  agency: [
    { label: "Software Development", href: "/agency#software" },
    { label: "Mobile Apps", href: "/agency#mobile" },
    { label: "Web Development", href: "/agency#web" },
    { label: "AI Solutions", href: "/agency#ai" },
    { label: "UI/UX Design", href: "/agency#design" },
    { label: "Digital Marketing", href: "/agency#marketing" },
  ],
  academy: [
    { label: "All Courses", href: "/academy" },
    { label: "Web & Mobile Dev", href: "/academy/course/web-mobile-development" },
    { label: "Graphics Design", href: "/academy/course/graphics-designing" },
    { label: "AI for Business", href: "/academy/course/ai-business" },
    { label: "Cybersecurity", href: "/academy/course/cybersecurity" },
    { label: "Digital Marketing", href: "/academy/course/digital-marketing" },
  ],
};

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={`relative overflow-hidden ${isDark ? "bg-[#030305] border-t border-white/5" : "bg-gray-50 border-t border-gray-200"}`}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </>
        ) : (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-3xl" />
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img 
                src="/dreammorelogo.jpg" 
                alt="DreamMore" 
                className="h-14 w-14 object-cover rounded-full"
              />
            </Link>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${isDark ? "text-white/50" : "text-gray-600"}`}>
              Empowering Africa through digital innovation. We build world-class solutions for businesses and train the next generation of African creators.
            </p>
            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:suport@dreammoredigitals.com" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-white/50 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}>
                <Mail className="w-4 h-4" style={{ color: "#f47822" }} />
                suport@dreammoredigitals.com
              </a>
              <a href="tel:+251993132122" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-white/50 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}>
                <Phone className="w-4 h-4" style={{ color: "#f47822" }} />
                +251 993 132 122
              </a>
              <a href="https://www.dreammoredigitals.com" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-white/50 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}>
                <ExternalLink className="w-4 h-4" style={{ color: "#f47822" }} />
                www.dreammoredigitals.com
              </a>
              <div className={`flex items-center gap-3 text-sm ${isDark ? "text-white/50" : "text-gray-600"}`}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#f47822" }} />
                Bahirdar, Ethiopia
              </div>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                {
                  label: "TikTok",
                  href: "https://www.tiktok.com/@dreammorecompany",
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/dreammorecompany/",
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  ),
                },
                {
                  label: "Telegram",
                  href: "https://t.me/DreamMoreCompany",
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/dreammore21/",
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
              ].map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "text-white/40 hover:text-orange-400 hover:border-orange-400/30 bg-white/5 border border-white/10"
                      : "text-gray-500 hover:text-orange-500 hover:border-orange-500/30 bg-white border border-gray-200"
                  }`}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="hidden md:block">
            <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isDark ? "text-white" : "text-gray-900"}`}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-sm transition-colors ${isDark ? "text-white/50 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isDark ? "text-white" : "text-gray-900"}`}>Agency</h4>
            <ul className="space-y-3">
              {footerLinks.agency.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-sm transition-colors ${isDark ? "text-white/50 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isDark ? "text-white" : "text-gray-900"}`}>Academy</h4>
            <ul className="space-y-3">
              {footerLinks.academy.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-sm transition-colors ${isDark ? "text-white/50 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className={`py-8 border-t border-b ${isDark ? "border-white/5" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Stay in the loop</h4>
              <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-600"}`}>Get the latest tech insights and course updates.</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 md:w-72 px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors ${
                  isDark 
                    ? "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-orange-400/50" 
                    : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-400"
                }`}
              />
              <button type="submit" className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-500"}`}>
            © {new Date().getFullYear()} DreamMore Digital Ecosystem. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className={`text-xs transition-colors ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-500 hover:text-gray-700"}`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`text-xs transition-colors ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-500 hover:text-gray-700"}`}>
              Terms of Service
            </Link>
            <Link href="/cookies" className={`text-xs transition-colors ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-500 hover:text-gray-700"}`}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
