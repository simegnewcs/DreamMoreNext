"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ForgotPasswordClient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // TODO: Implement actual password reset API call
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      <div className="absolute inset-0 pointer-events-none">
        {isDark && (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#f47822]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#f47822]/3 rounded-full blur-[100px]" />
          </>
        )}
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-10" : "opacity-5"}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="/dreammorelogo.jpg" 
              alt="DreamMore" 
              className="h-12 w-12 object-cover rounded-full" 
            />
            <span className="text-xl font-black">
              <span className={isDark ? "text-white" : "text-gray-900"}>Dream</span>
              <span className="gradient-text">More</span>
            </span>
          </Link>
          <h1 className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {success ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
            {success 
              ? "We've sent a password reset link to your email"
              : "Enter your email to reset your password"
            }
          </p>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-xl"}`}>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className={`text-sm mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                If an account exists with <span className="font-semibold">{email}</span>, you'll receive password reset instructions shortly.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all duration-200 text-sm"
              >
                Back to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 transition-colors ${
                      isDark 
                        ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all duration-200 disabled:opacity-50 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? "text-white/40" : "text-gray-500"}`}>
          Remember your password?{" "}
          <Link href="/login" className="text-[#f47822] hover:text-[#e06b18] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
