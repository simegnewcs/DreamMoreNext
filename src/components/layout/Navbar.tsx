"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon, User, LogOut, LayoutDashboard, Camera, Settings, Sparkles, Globe2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { coursesAPI } from "@/lib/api";
import { signOut } from "next-auth/react";

const navLinks = [
  { labelKey: "nav.home", href: "/" },
  {
    labelKey: "nav.agency",
    href: "/agency",
    children: [
      { labelKey: "common.viewDetails", href: "/agency" },
      { labelKey: "home.agencyCta", href: "/agency#software-development" },
      { labelKey: "common.learnMore", href: "/agency#mobile-app-development" },
      { labelKey: "common.learnMore", href: "/agency#website-development" },
      { labelKey: "common.learnMore", href: "/agency#ai-solutions" },
      { labelKey: "common.learnMore", href: "/agency#uiux-design" },
      { labelKey: "common.learnMore", href: "/agency#branding-identity" },
      { labelKey: "common.learnMore", href: "/agency#digital-marketing" },
      { labelKey: "common.learnMore", href: "/agency#cctv-intelligence-systems" },
    ],
  },
  {
    labelKey: "nav.academy",
    href: "/academy",
    getChildren: (dynamicCourses: any[]) => [
      { labelKey: "common.viewDetails", href: "/academy" },
      ...(dynamicCourses?.map(course => ({
        labelKey: course.title,
        href: `/academy/course/${course.slug}`
      })) || []),
    ],
  },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.team", href: "/team" },
  { labelKey: "nav.testimonials", href: "/#testimonials" },
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [user, setUser] = useState<{name: string; email: string; role: string; avatar?: string} | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isAmharic } = useLanguage();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const router = useRouter();

  // Check login status
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkUser);
    
    // Custom event for same-tab updates
    const handleUserUpdate = () => checkUser();
    window.addEventListener("userUpdated", handleUserUpdate);
    
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  // Fetch courses for dynamic dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getAll({ limit: 50 });
        if (response.success && response.data?.courses) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses for navbar:", error);
      }
    };
    fetchCourses();
  }, []);
  
  // Re-check user when pathname changes (after navigation)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && profileMenuRef.current.contains(target)) return;
      setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    
    // Sign out from NextAuth (Google session)
    await signOut({ redirect: false });
    
    // Hard redirect to clear all state
    window.location.href = "/";
  };

  const updateStoredUser = (updatedUser: any) => {
    const nextUser = { ...(user || {}), ...updatedUser };
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
    window.dispatchEvent(new Event("userUpdated"));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setAvatarError(null);
    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        headers: token ? { "x-auth-token": token } : {},
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      updateStoredUser({ avatar: data.avatar });
      setProfileMenuOpen(false);
      const dashboardPath = user.role === "admin" ? "/admin" : user.role === "instructor" ? "/instructor" : "/lms";
      router.push(dashboardPath);
    } catch (error: any) {
      setAvatarError(error.message || "Unable to upload avatar");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  const handleNavigate = (href: string) => {
    setDropdown(null);
    setMobileOpen(false);
    setProfileMenuOpen(false);
    setMobileExpanded(null);

    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark 
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3" 
            : "bg-white/90 backdrop-blur-xl border-b border-gray-200 py-3 shadow-lg"
          : isDark 
            ? "bg-transparent py-5" 
            : "bg-white/50 backdrop-blur-md py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/dreammorelogo.jpg" 
              alt="DreamMore" 
              className="h-14 w-14 object-cover rounded-full"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const children = link.getChildren ? link.getChildren(courses) : link.children;
              const label = t(link.labelKey);
              return children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.href)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark 
                      ? "text-white/70 hover:text-white hover:bg-white/5" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}>
                    {label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <AnimatePresence>
                    {dropdown === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full left-0 mt-1 rounded-xl overflow-hidden shadow-xl ${
                          children.length > 6 ? "w-[600px]" : "w-52"
                        } ${isDark ? "glass-dark" : "bg-white border border-gray-200"}`}
                      >
                        <div className={children.length > 6 ? "grid grid-cols-3 p-2 gap-0.5" : ""}>
                          {children.map((child) => (
                            <button
                              key={child.href}
                              type="button"
                              onClick={() => handleNavigate(child.href)}
                              className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                isDark
                                  ? "text-white/70 hover:text-white hover:bg-[#f47822]/20"
                                  : "text-gray-600 hover:text-[#f47822] hover:bg-[#f47822]/10"
                              }`}
                            >
                              {typeof child.labelKey === "string" && child.labelKey.startsWith("nav.") || child.labelKey.startsWith("home.") || child.labelKey.startsWith("common.") ? t(child.labelKey) : child.labelKey}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavigate(link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? isDark 
                        ? "text-cyan-400 bg-cyan-400/10" 
                        : "text-orange-500 bg-orange-50"
                      : isDark 
                        ? "text-white/70 hover:text-white hover:bg-white/5" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* CTA & Language/Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center rounded-xl border px-1 py-1" style={{ borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)" }}>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${language === "en" ? (isDark ? "bg-white/10 text-white" : "bg-orange-50 text-orange-600") : (isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
              >
                🇬🇧 ENG
              </button>
              <button
                type="button"
                onClick={() => setLanguage("am")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${language === "am" ? (isDark ? "bg-white/10 text-white" : "bg-orange-50 text-orange-600") : (isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
              >
                🇪🇹 አማ
              </button>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#f47822] to-[#15142a] border border-white/20 flex items-center justify-center text-white text-xs font-bold">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name || user.email} className="w-full h-full object-cover" />
                      ) : (
                        (user.name || user.email || "?").charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
                      {(user.name || user.email || "").split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden ${isDark ? "bg-[#111827] border-white/10" : "bg-white border-gray-200"}`}
                      >
                        <div className={`px-4 py-3 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
                          <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{user.name || user.email}</p>
                          <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isDark ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
                          >
                            <Camera className="w-4 h-4" />
                            {uploadingAvatar ? t("common.loading") : t("nav.uploadPhoto")}
                          </button>
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

                          <button
                            type="button"
                            onClick={() => handleNavigate(user.role === "admin" ? "/admin" : user.role === "instructor" ? "/instructor" : "/lms")}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isDark ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            {t("nav.dashboard")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNavigate(user.role === "admin" ? "/admin" : user.role === "instructor" ? "/instructor" : "/lms/settings")}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isDark ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
                          >
                            <Settings className="w-4 h-4" />
                            {t("nav.accountSettings")}
                          </button>
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false);
                              handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-50 ${isDark ? "text-red-400 hover:bg-red-400/10" : "text-red-500 hover:bg-red-50"}`}
                          >
                            <LogOut className="w-4 h-4" />
                            {isLoggingOut ? t("common.loading") : t("nav.logout")}
                          </button>
                        </div>
                        {avatarError && (
                          <p className={`px-3 pb-3 text-xs ${isDark ? "text-red-400" : "text-red-500"}`}>{avatarError}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isDark 
                    ? "text-white/80 hover:text-white hover:bg-white/5" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{ 
                background: isDark ? "rgba(244,120,34,0.15)" : "rgba(244,120,34,0.1)", 
                border: "1px solid #f47822" 
              }}
              aria-label={t("nav.themeToggle")}
            >
              {isDark ? (
                <Sun className="w-5 h-5" style={{ color: "#f47822" }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: "#f47822" }} />
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all ${
              isDark 
                ? "text-white/70 hover:text-white hover:bg-white/5" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden backdrop-blur-xl border-t overflow-hidden ${
              isDark 
                ? "bg-black/95 border-white/5" 
                : "bg-white/95 border-gray-200 shadow-lg"
            }`}
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => {
                const children = link.getChildren ? link.getChildren(courses) : link.children;
                const label = t(link.labelKey);
                return (
                  <div key={link.href}>
                    {children ? (
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.href ? null : link.href)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isDark
                            ? "text-white/70 hover:text-white hover:bg-white/5"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileExpanded === link.href ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          pathname === link.href
                            ? isDark
                              ? "text-cyan-400 bg-cyan-400/10"
                              : "text-orange-500 bg-orange-50"
                            : isDark
                              ? "text-white/70 hover:text-white hover:bg-white/5"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </Link>
                    )}
                    {children && mobileExpanded === link.href && (
                      <div className="ml-4 mt-1 space-y-1">
                        {children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2 rounded-lg text-xs transition-all ${
                              isDark
                                ? "text-white/50 hover:text-white hover:bg-[#f47822]/20"
                                : "text-gray-500 hover:text-[#f47822] hover:bg-[#f47822]/10"
                            }`}
                          >
                            {typeof child.labelKey === "string" && child.labelKey.startsWith("nav.") || child.labelKey.startsWith("home.") || child.labelKey.startsWith("common.") ? t(child.labelKey) : child.labelKey}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#f47822] to-[#15142a] flex items-center justify-center text-white font-bold">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name || user.email} className="w-full h-full object-cover" />
                        ) : (
                          (user.name || user.email || "?").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{user.name || user.email}</p>
                        <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{user.email}</p>
                      </div>
                      {(user.role === "admin" || user.role === "instructor") && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f47822] text-white font-semibold capitalize">{user.role}</span>
                      )}
                    </div>
                    {/* Panel link for mobile */}
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    {user.role === "instructor" && (
                      <Link
                        href="/instructor"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Instructor Panel
                      </Link>
                    )}
                    {user.role === "student" && (
                      <Link
                        href="/lms"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        My Learning
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark 
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
                          : "bg-red-50 text-red-500 hover:bg-red-100"
                      }`}
                    >
                      {isLoggingOut ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          {t("common.loading")}
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          {t("nav.logout")}
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold ${
                      isDark 
                        ? "border-white/10 text-white/80 hover:bg-white/5" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {t("nav.login")}
                  </Link>
                )}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                  style={{ 
                    background: isDark ? "rgba(244,120,34,0.15)" : "rgba(244,120,34,0.1)", 
                    border: "1px solid #f47822", 
                    color: "#f47822" 
                  }}
                >
                  {isDark ? (
                    <><Sun className="w-4 h-4" /> {t("nav.lightMode")}</>
                  ) : (
                    <><Moon className="w-4 h-4" /> {t("nav.darkMode")}</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
