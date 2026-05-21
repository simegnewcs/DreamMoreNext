"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { authAPI } from "@/lib/api";
import { signIn } from "next-auth/react";

export default function LoginClient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/academy";
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: redirect });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await authAPI.login(form.email, form.password);

      if (!result.success) {
        setError(result.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(result.data?.user));
      localStorage.setItem("token", result.data?.token || "");
      
      // Dispatch event to update Navbar
      window.dispatchEvent(new Event("userUpdated"));
      
      setLoading(false);
      
      // Redirect based on role
      const userRole = result.data?.user?.role;
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "instructor") {
        router.push("/instructor");
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
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
          <h1 className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Welcome Back</h1>
          <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>Sign in to your DreamMore account</p>
          
          {/* Redirect Notice */}
          {redirect !== "/academy" && (
            <div className={`mt-4 px-4 py-2 rounded-xl text-xs ${isDark ? "bg-[#f47822]/10 text-[#f47822] border border-[#f47822]/20" : "bg-orange-50 text-orange-600 border border-orange-200"}`}>
              You&apos;ll be redirected after login to continue your application
            </div>
          )}
        </div>

        {/* Google Sign In */}
        <div className={`rounded-2xl p-8 mb-4 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-xl"}`}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border font-semibold text-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 ${
              isDark
                ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
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
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
            <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>or sign in with email</span>
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
          </div>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-xl"}`}>
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 transition-colors ${
                  isDark 
                    ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 transition-colors pr-12 ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
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
              <div className="text-right mt-1.5">
                <Link href="/forgot-password" className="text-xs text-[#f47822] hover:text-[#e06b18] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all duration-200 disabled:opacity-50 text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? "text-white/40" : "text-gray-500"}`}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#f47822] hover:text-[#e06b18] font-medium transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
