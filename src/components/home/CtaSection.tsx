"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-24 bg-[#050508] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-purple-500/8 to-pink-500/8" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-badge mb-6">Ready to Start?</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Transform Your{" "}
            <span className="gradient-text">Ideas Into Reality?</span>
          </h2>
          <p className="text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you need a world-class digital product built or want to master in-demand tech skills — DreamMore is your ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agency#contact" className="btn-primary text-base py-4 px-8">
              Start a Project
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/academy" className="btn-purple text-base py-4 px-8">
              Join the Academy
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-secondary text-base py-4 px-8">
              <Phone className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
