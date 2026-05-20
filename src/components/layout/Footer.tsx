"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, Phone, MapPin, Share2, ExternalLink, Camera, Play, Send } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Careers", href: "/careers" },
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
    { label: "Full Stack Dev", href: "/academy/course/full-stack-development" },
    { label: "UI/UX Design", href: "/academy/course/ui-ux-design" },
    { label: "AI Engineering", href: "/academy/course/ai-engineering" },
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
              <a href="mailto:hello@dreammore.et" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-white/50 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}>
                <Mail className="w-4 h-4" style={{ color: "#f47822" }} />
                hello@dreammore.et
              </a>
              <a href="tel:+251911000000" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-white/50 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}>
                <Phone className="w-4 h-4" style={{ color: "#f47822" }} />
                +251 911 000 000
              </a>
              <div className={`flex items-center gap-3 text-sm ${isDark ? "text-white/50" : "text-gray-600"}`}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#f47822" }} />
                Bole Road, Addis Ababa, Ethiopia
              </div>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Share2, href: "#", label: "Twitter" },
                { icon: ExternalLink, href: "#", label: "LinkedIn" },
                { icon: Camera, href: "#", label: "Instagram" },
                { icon: Play, href: "#", label: "YouTube" },
                { icon: Send, href: "#", label: "Telegram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isDark 
                      ? "text-white/40 hover:text-orange-400 hover:border-orange-400/30 bg-white/5 border border-white/10" 
                      : "text-gray-500 hover:text-orange-500 hover:border-orange-500/30 bg-white border border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
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

          <div>
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

          <div>
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
