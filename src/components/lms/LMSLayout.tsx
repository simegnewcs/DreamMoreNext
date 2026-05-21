"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen, Home, Award, FileText,
  Settings, LogOut, PlayCircle, HelpCircle, PanelLeftClose, PanelLeft, Menu,
  Users, LayoutDashboard, ChevronDown, ChevronRight, Lock, Monitor
} from "lucide-react";
import { InstructorProvider, useInstructor } from "@/context/InstructorContext";
import { useAuth } from "@/hooks/useAuth";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface LMSLayoutProps {
  children: React.ReactNode;
  course?: { id: number; title: string; slug: string } | null;
}

// ── Student nav (unchanged) ────────────────────────────────────────────────
const studentNavSections = [
  {
    label: "Main",
    items: [
      { icon: Home, label: "Dashboard", href: "/lms" },
      { icon: BookOpen, label: "My Courses", href: "/lms/courses" },
      { icon: PlayCircle, label: "Continue", href: "/lms/courses" },
    ],
  },
  {
    label: "Learning",
    items: [
      { icon: Award, label: "Certificates", href: "/lms/certificates" },
      { icon: FileText, label: "Assignments", href: "/lms/assignments" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: HelpCircle, label: "Help", href: "/lms/support" },
      { icon: Settings, label: "Settings", href: "/lms/settings" },
    ],
  },
];

// ── Instructor sidebar content ─────────────────────────────────────────────
function InstructorSidebar({ isCollapsed, user, onLogout }: { isCollapsed: boolean; user: User | null; onLogout: () => void }) {
  const pathname = usePathname();
  const { assignedCourses, stats, loading } = useInstructor();
  const [coursesOpen, setCoursesOpen] = useState(true);

  const isActive = (href: string) =>
    href === "/instructor"
      ? pathname === "/instructor"
      : pathname?.startsWith(href) && pathname !== "/instructor";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-zinc-100 ${isCollapsed ? "justify-center" : ""}`}>
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#f47822] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">DM</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-sm font-bold text-gray-900 leading-none block">DreamMore</span>
              <span className="text-xs text-orange-500 leading-none font-semibold">Instructor Panel</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Dashboard */}
        {!isCollapsed && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">Overview</p>}
        <Link href="/instructor"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            isActive("/instructor") ? "bg-orange-50 text-[#f47822]" : "text-gray-700 hover:bg-gray-50"
          } ${isCollapsed ? "justify-center" : ""}`}>
          <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${isActive("/instructor") ? "text-[#f47822]" : "text-gray-500"}`} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* LMS */}
        <Link href="/instructor/lms"
          title={isCollapsed ? "LMS" : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            isActive("/instructor/lms") ? "bg-orange-50 text-[#f47822]" : "text-gray-700 hover:bg-gray-50"
          } ${isCollapsed ? "justify-center" : ""}`}>
          <Monitor className={`w-4 h-4 flex-shrink-0 ${isActive("/instructor/lms") ? "text-[#f47822]" : "text-gray-500"}`} />
          {!isCollapsed && <span>LMS</span>}
          {isActive("/instructor/lms") && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f47822]" />}
        </Link>

        {/* Students */}
        <Link href="/instructor/students"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            isActive("/instructor/students") ? "bg-orange-50 text-[#f47822]" : "text-gray-700 hover:bg-gray-50"
          } ${isCollapsed ? "justify-center" : ""}`}>
          <Users className={`w-4 h-4 flex-shrink-0 ${isActive("/instructor/students") ? "text-[#f47822]" : "text-gray-500"}`} />
          {!isCollapsed && (
            <span className="flex-1">Students</span>
          )}
          {!isCollapsed && stats.total_students > 0 && (
            <span className="text-[10px] bg-orange-100 text-orange-600 rounded-full px-1.5 py-0.5 font-bold">{stats.total_students}</span>
          )}
        </Link>

        {/* Assigned Courses */}
        {!isCollapsed && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mt-3 mb-1">Assigned Courses</p>}
        {isCollapsed && <div className="border-t border-zinc-100 my-2" />}

        {!isCollapsed && (
          <button onClick={() => setCoursesOpen(o => !o)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="flex-1 text-left">Courses</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-1.5 font-bold">{assignedCourses.length}</span>
            {coursesOpen ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
          </button>
        )}

        {(coursesOpen || isCollapsed) && (
          <div className={`space-y-0.5 ${!isCollapsed ? "pl-3" : ""}`}>
            {loading ? (
              <div className="px-3 py-2 text-xs text-gray-400">Loading…</div>
            ) : assignedCourses.length === 0 ? (
              !isCollapsed && <div className="px-3 py-2 text-xs text-gray-400">No courses assigned yet.</div>
            ) : assignedCourses.map(course => {
              const href = `/lms/course/${course.slug}`;
              const active = pathname?.startsWith(href);
              return (
                <Link key={course.id} href={href} title={isCollapsed ? course.title : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active ? "bg-orange-50 text-[#f47822]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}>
                  <BookOpen className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-[#f47822]" : "text-gray-400"}`} />
                  {!isCollapsed && <span className="truncate">{course.title}</span>}
                  {active && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f47822]" />}
                </Link>
              );
            })}
          </div>
        )}

        {/* Settings */}
        {!isCollapsed && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mt-3 mb-1">Account</p>}
        <Link href="/lms/settings"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            isActive("/lms/settings") ? "bg-orange-50 text-[#f47822]" : "text-gray-700 hover:bg-gray-50"
          } ${isCollapsed ? "justify-center" : ""}`}>
          <Settings className={`w-4 h-4 flex-shrink-0 ${isActive("/lms/settings") ? "text-[#f47822]" : "text-gray-500"}`} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </nav>

      {/* User footer */}
      <div className={`p-3 border-t border-zinc-100 ${isCollapsed ? "px-2" : ""}`}>
        <div className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-50 transition-colors ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#f47822] flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "I"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-white" />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || "Instructor"}</p>
                <p className="text-[10px] text-orange-500 font-medium">Instructor</p>
              </div>
              <button onClick={onLogout} className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Student sidebar content ────────────────────────────────────────────────
function StudentSidebar({ isCollapsed, user, onLogout }: { isCollapsed: boolean; user: User | null; onLogout: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/lms" ? pathname === "/lms" : pathname?.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-zinc-100 ${isCollapsed ? "justify-center" : ""}`}>
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#f47822] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">DM</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-sm font-bold text-gray-900 leading-none block">DreamMore</span>
              <span className="text-xs text-gray-500 leading-none">Academy LMS</span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <button onClick={() => {}} className="ml-auto p-1 rounded-lg text-gray-500 hover:bg-gray-100 hidden lg:flex">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {studentNavSections.map(section => (
          <div key={section.label}>
            {!isCollapsed && <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-1.5">{section.label}</p>}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.label} href={item.href} title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      active ? "bg-orange-50 text-[#f47822]" : "text-gray-700 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center px-2.5" : ""}`}>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#f47822]" : "text-gray-500"}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                    {active && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f47822]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {isCollapsed && (
        <div className="px-2 py-2 border-t border-zinc-100">
          <button onClick={() => {}} className="w-full flex items-center justify-center p-2 rounded-xl text-gray-500 hover:bg-gray-100">
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className={`p-3 border-t border-zinc-100 ${isCollapsed ? "px-2" : ""}`}>
        <div className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-50 transition-colors ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#f47822] flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || "Student"}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email || ""}</p>
              </div>
              <button onClick={onLogout} className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────
function LMSLayoutInner({ children, course }: LMSLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isInstructor, canAccessCourse, loading: instructorLoading } = useInstructor();

  // RBAC: if instructor tries to access an unassigned course, redirect
  useEffect(() => {
    if (!instructorLoading && isInstructor && course) {
      if (!canAccessCourse(course.slug)) {
        router.replace("/instructor");
      }
    }
  }, [instructorLoading, isInstructor, course, canAccessCourse, router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const SidebarContent = isInstructor
    ? () => <InstructorSidebar isCollapsed={isCollapsed} user={user} onLogout={handleLogout} />
    : () => <StudentSidebar isCollapsed={isCollapsed} user={user} onLogout={handleLogout} />;

  // Show access-denied if instructor + unassigned course (before redirect fires)
  const accessDenied = !instructorLoading && isInstructor && course && !canAccessCourse(course.slug);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-zinc-200 sticky top-0 h-screen z-40 transition-all duration-200 ${isCollapsed ? "w-[60px]" : isInstructor ? "w-[240px]" : "w-[220px]"}`}>
        <SidebarContent />
        {/* collapse toggle */}
        <button onClick={() => setIsCollapsed(c => !c)}
          className="absolute bottom-20 -right-3 w-6 h-6 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-gray-700 transition-colors hidden lg:flex">
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 -rotate-90" />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className={`relative ${isInstructor ? "w-[240px]" : "w-[220px]"} h-full bg-white shadow-xl flex flex-col`}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-zinc-200 flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-[#f47822] flex items-center justify-center">
          <span className="text-white text-xs font-black">DM</span>
        </div>
        <span className="text-sm font-bold text-zinc-900">DreamMore</span>
        {isInstructor && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold ml-1">Instructor</span>}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:mt-0 mt-14">
        {accessDenied ? (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <Lock className="w-14 h-14 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Access Restricted</h2>
            <p className="text-gray-500 text-sm mb-5">You are not assigned to this course.</p>
            <a href="/instructor" className="px-4 py-2 bg-[#f47822] text-white rounded-xl text-sm font-semibold hover:bg-[#e06b18]">Back to Dashboard</a>
          </div>
        ) : children}
      </main>
    </div>
  );
}

export default function LMSLayout(props: LMSLayoutProps) {
  return (
    <InstructorProvider>
      <LMSLayoutInner {...props} />
    </InstructorProvider>
  );
}
