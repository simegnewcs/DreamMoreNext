"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, User, Mail, Phone } from "lucide-react";
import { authAPI } from "@/lib/api";
import { signIn } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterClient() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendMessage("");
    setResendSuccess(false);
    setLoading(true);

    try {
      const result = await authAPI.register(form.email, form.password, form.fullName, "student");

      if (!result.success) {
        setError(result.error || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess(true);

    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!form.email) return;

    setResendLoading(true);
    setResendMessage("");
    setResendSuccess(false);

    try {
      const result = await authAPI.resendVerification(form.email);

      if (!result.success) {
        setResendSuccess(false);
        setResendMessage(result.error || "Failed to resend verification email.");
      } else {
        setResendSuccess(true);
        setResendMessage("Verification email sent again. Please check your inbox.");
      }
    } catch (err) {
      setResendSuccess(false);
      setResendMessage("An error occurred while resending the verification email.");
      console.error("Resend verification error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
        <div className={`text-center rounded-2xl p-10 max-w-md w-full ${isDark ? "glass" : "bg-white shadow-xl border border-gray-200"}`}>
          <Link href="/" className="inline-flex items-center gap-2 mb-6 justify-center">
            <img 
              src="/dreammorelogo.jpg" 
              alt="DreamMore" 
              className="h-10 w-10 object-cover rounded-full"
            />
            <span className="text-xl font-black">
              <span className={isDark ? "text-white" : "text-gray-900"}>Dream</span>
              <span className="gradient-text">More</span>
            </span>
          </Link>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-green-400/10 border border-green-400/20" : "bg-green-100 border border-green-200"}`}>
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{t("auth.accountCreated")}</h2>
          <p className={`text-sm mb-4 ${isDark ? "text-white/55" : "text-gray-600"}`}>{t("auth.verifyEmail")}</p>

          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resendLoading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isDark ? "bg-white/5 text-white hover:bg-white/10" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
          >
            {resendLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("auth.sending")}
              </>
            ) : (
              <>
                {t("auth.resendVerification")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {resendMessage && (
            <p className={`mt-3 text-sm ${resendSuccess ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-red-400" : "text-red-600")}`}>
              {resendMessage}
            </p>
          )}

          <Link href="/login" className="btn-primary justify-center mt-4">{t("auth.goToLogin")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-24 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[100px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="/dreammorelogo.jpg" 
              alt="DreamMore" 
              className="h-10 w-10 object-cover rounded-full"
            />
            <span className="text-xl font-black">
              <span className={isDark ? "text-white" : "text-gray-900"}>Dream</span>
              <span className="gradient-text">More</span>
            </span>
          </Link>
          <h1 className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{t("auth.registerTitle")}</h1>
          <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-600"}`}>{t("auth.registerSubtitle")}</p>
        </div>

        {/* Google Sign Up */}
        <div className={`rounded-2xl p-8 mb-4 ${isDark ? "glass" : "bg-white shadow-xl border border-gray-200"}`}>
          <button
            type="button"
            onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/academy" }); }}
            disabled={googleLoading}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border font-semibold text-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 ${
              isDark 
                ? "border-white/15 bg-white/5 text-white hover:bg-white/10" 
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {t("auth.googleSignUp")}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-300"}`} />
            <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-500"}`}>{t("auth.orRegister")}</span>
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-300"}`} />
          </div>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? "glass" : "bg-white shadow-xl border border-gray-200"}`}>
          {error && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm ${isDark ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>{t("auth.fullNameLabel")}</label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-gray-400"}`} />
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder={t("auth.fullNamePlaceholder")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-cyan-400/50" 
                      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>{t("auth.emailLabel")}</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-gray-400"}`} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("auth.emailPlaceholder")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-cyan-400/50" 
                      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>{t("auth.phoneLabel")}</label>
              <div className="relative">
                <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-gray-400"}`} />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t("auth.phonePlaceholder")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-cyan-400/50" 
                      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>{t("auth.passwordLabel")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={t("auth.passwordPlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors pr-12 ${
                    isDark 
                      ? "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-cyan-400/50" 
                      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("auth.creatingAccount")}
                </>
              ) : (
                <>
                  {t("auth.createAccount")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? "text-white/40" : "text-gray-500"}`}>
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
            {t("auth.signIn")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
