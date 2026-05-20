"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, FileText, CreditCard, BookOpen, Monitor,
  Award, Newspaper, Settings, LogOut, CheckCircle, XCircle,
  RefreshCw, Eye, TrendingUp, Clock, AlertCircle, Menu, X,
  Sun, Moon, Bell, Search, Filter, MoreVertical, ChevronDown,
  ArrowUpRight, DollarSign, GraduationCap, BarChart3, Plus, Save, Trash2, Pencil,
  Loader2, Video, BookMarked, Users2, ChevronRight, Play, FileArchive, ClipboardList, Layers, Upload,
  BadgeCheck, ShieldOff, Hash, CalendarDays, UserCheck, Send,
  ExternalLink, Globe, ImageIcon, Tag, ToggleLeft, ToggleRight, FolderOpen,
  Star, Quote, MessageSquare, UserCheck2, Share2, ClipboardCheck
} from "lucide-react";
import { coursesAPI, applicationsAPI, usersAPI } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import RichTextEditor from "./RichTextEditor";

// Sidebar items with dynamic badge functions
const getSidebarItems = (stats: { users: number; applications: number; courses: number }) => [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", badge: null },
  { icon: Users, label: "Users", id: "users", badge: stats.users > 0 ? `${stats.users}` : null },
  { icon: FileText, label: "Applications", id: "applications", badge: stats.applications > 0 ? `${stats.applications}` : null },
  { icon: CreditCard, label: "Payments", id: "payments", badge: null },
  { icon: BookOpen, label: "Courses", id: "courses", badge: stats.courses > 0 ? `${stats.courses}` : null },
  { icon: Monitor, label: "LMS", id: "lms", badge: null },
  { icon: Award, label: "Certificates", id: "certificates", badge: null },
  { icon: Newspaper, label: "Blog", id: "blog", badge: null },
  { icon: TrendingUp, label: "Portfolio", id: "portfolio", badge: null },
  { icon: BarChart3, label: "Testimonials", id: "testimonials", badge: null },
  { icon: UserCheck2, label: "Team", id: "team", badge: null },
  { icon: ClipboardCheck, label: "Course Assignment", id: "course-assignment", badge: null },
  { icon: Settings, label: "Settings", id: "settings", badge: null },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifications, setNotifications] = useState(3);
  const [user, setUser] = useState<{name: string; email: string; role: string} | null>(null);
  
  // Courses, applications, users and stats state
  const [courses, setCourses] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    applications: 0,
    pendingApplications: 0,
    courses: 0,
    revenue: 0,
    students: 0,
    totalPaidStudents: 0,
    totalRevenue: 0
  });
  const [paidStudents, setPaidStudents] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    price: "",
    duration: "",
    level: "",
    instructor: "",
    technologies: "",
  });
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Users management state
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Fetch courses, applications, users and stats on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesRes, appsRes, usersRes] = await Promise.all([
          coursesAPI.getAll(),
          applicationsAPI.getAll(),
          usersAPI.getAll().catch(() => ({ success: false, data: { users: [], total: 0 } }))
        ]);
        
        if (coursesRes.success && coursesRes.data) {
          setCourses(coursesRes.data.courses || []);
        }
        if (appsRes.success && appsRes.data) {
          setApplications(appsRes.data.applications || []);
        }
        if (usersRes.success && usersRes.data) {
          setUsers(usersRes.data.users || []);
          setStats(prev => ({ ...prev, users: usersRes.data.total || usersRes.data.users?.length || 0 }));
        }

        // Fetch payment stats
        const paymentRes = await fetch('/api/admin/payment-stats');
        const paymentData = await paymentRes.json();
        if (paymentData.success) {
          setStats(prev => ({
            ...prev,
            totalRevenue: paymentData.stats.totalRevenue,
            totalPaidStudents: paymentData.stats.totalPaidStudents,
          }));
          setPaidStudents(paymentData.paidStudents || []);
        }
        
        // Calculate other stats
        setStats(prev => ({
          ...prev,
          applications: appsRes.data?.applications?.length || 0,
          pendingApplications: appsRes.data?.applications?.filter((a: any) => a.status === 'pending').length || 0,
          courses: coursesRes.data?.courses?.length || 0,
          revenue: 0,
        }));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadActivities = async () => {
      try {
        setActivitiesLoading(true);
        const res = await fetch("/api/admin/recent-activity");
        const data = await res.json();
        if (data.success) setRecentActivities(data.activities || []);
      } catch (e) {
        console.error("Error loading activities:", e);
      } finally {
        setActivitiesLoading(false);
      }
    };

    loadData();
    loadActivities();
  }, []);

  // Check auth
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login?redirect=/admin");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "admin") {
      router.push("/academy");
      return;
    }
    setUser(parsed);
  }, [router]);

  const [viewingApplication, setViewingApplication] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lmsData, setLmsData] = useState<any>(null);
  const [lmsLoading, setLmsLoading] = useState(false);
  const [lmsTab, setLmsTab] = useState<'overview' | 'students'>('overview');
  const [lmsCourseFilter, setLmsCourseFilter] = useState('all');

  // LMS content manager
  const [lmsMgrCourse, setLmsMgrCourse] = useState<any>(null);
  const [lmsMgrTree, setLmsMgrTree] = useState<any[]>([]);
  const [lmsMgrLoading, setLmsMgrLoading] = useState(false);
  const [lmsMgrExpanded, setLmsMgrExpanded] = useState<number | null>(null);
  const [lmsMgrExpandedWeek, setLmsMgrExpandedWeek] = useState<number | null>(null);

  // sub-forms visibility
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [showWeekForm, setShowWeekForm] = useState<number | null>(null);
  const [showVideoForm, setShowVideoForm] = useState<number | null>(null);
  const [showNoteForm, setShowNoteForm] = useState<number | null>(null);
  const [showAssignForm, setShowAssignForm] = useState<number | null>(null);

  // form field states
  const [phaseForm, setPhaseForm] = useState({ title: '', description: '', duration_weeks: 1, learning_objectives: '' });
  const [weekForm, setWeekForm] = useState({ title: '', description: '', learning_topics: '' });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', video_url: '', thumbnail_url: '', duration_minutes: '' });
  const [noteForm, setNoteForm] = useState({ title: '', description: '', pdf_url: '', file_size_mb: '' });
  const [assignForm, setAssignForm] = useState({ title: '', description: '', assignment_type: 'assignment', deadline: '', max_score: '100' });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [noteUploading, setNoteUploading] = useState(false);
  const [noteUploadedFile, setNoteUploadedFile] = useState<{ name: string; sizeMb: number } | null>(null);
  const noteFileInputRef = useRef<HTMLInputElement>(null);

  const openLmsMgr = async (course: any) => {
    setLmsMgrCourse(course);
    setLmsMgrLoading(true);
    setLmsMgrTree([]);
    setLmsMgrExpanded(null);
    setLmsMgrExpandedWeek(null);
    try {
      const res = await fetch(`/api/admin/lms/content?courseId=${course.id}`);
      const data = await res.json();
      if (data.success) setLmsMgrTree(data.phases || []);
    } catch (e) { console.error(e); }
    finally { setLmsMgrLoading(false); }
  };

  const closeLmsMgr = () => {
    setLmsMgrCourse(null);
    setShowPhaseForm(false);
    setShowWeekForm(null);
    setShowVideoForm(null);
    setShowNoteForm(null);
    setShowAssignForm(null);
    setFormError('');
  };

  const refreshMgrTree = async (courseId: number) => {
    const res = await fetch(`/api/admin/lms/content?courseId=${courseId}`);
    const data = await res.json();
    if (data.success) setLmsMgrTree(data.phases || []);
    setLmsData(null); // reset overview cache
  };

  const lmsMgrPost = async (payload: any) => {
    setFormSaving(true);
    setFormError('');
    try {
      const res = await fetch('/api/admin/lms/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed');
      await refreshMgrTree(lmsMgrCourse.id);
      return true;
    } catch (e: any) {
      setFormError(e.message || 'Error saving');
      return false;
    } finally { setFormSaving(false); }
  };

  useEffect(() => {
    if (activeSection !== 'lms') return;
    if (lmsData) return;
    const load = async () => {
      setLmsLoading(true);
      try {
        const res = await fetch('/api/admin/lms');
        const data = await res.json();
        if (data.success) setLmsData(data);
      } catch (e) {
        console.error('LMS fetch error:', e);
      } finally {
        setLmsLoading(false);
      }
    };
    load();
  }, [activeSection]);

  const updateStatus = async (id: number, status: string, notes?: string) => {
    try {
      const response = await applicationsAPI.updateStatus(String(id), status, notes);
      if (response.success) {
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status, admin_notes: notes } : a)));
        // Refresh stats
        setStats(prev => ({
          ...prev,
          pendingApplications: applications.filter((a: any) => a.status === 'pending').length,
        }));
      } else {
        alert('Failed to update status: ' + response.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Courses handlers
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const courseData = {
      slug: newCourse.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: newCourse.title,
      description: newCourse.description,
      short_description: newCourse.description.slice(0, 150),
      image: newCourse.image || "/images/courses/default.jpg",
      duration: newCourse.duration,
      level: newCourse.level || "Beginner",
      instructor: newCourse.instructor || "TBD",
      instructor_bio: "Experienced instructor with industry expertise.",
      price: parseInt(newCourse.price) || 0,
      category: newCourse.category,
      language: "English / Amharic",
      schedule: "Mon, Wed, Fri — 6:00 PM – 9:00 PM",
      certificate: true,
      technologies: newCourse.technologies.split(",").map(t => t.trim()).filter(Boolean),
      outcomes: ["Master core concepts", "Build real projects", "Get certified"],
      requirements: ["Basic computer skills", "Internet access", "Dedication to learn"],
      faqs: [],
    };
    
    const result = await coursesAPI.create(courseData);
    
    if (result.success) {
      // Refresh courses list
      const coursesRes = await coursesAPI.getAll();
      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data.courses || []);
      }
      setShowAddCourse(false);
      setNewCourse({
        title: "",
        category: "",
        description: "",
        image: "",
        price: "",
        duration: "",
        level: "",
        instructor: "",
        technologies: "",
      });
    } else {
      alert("Failed to create course: " + result.error);
    }
    setLoading(false);
  };

  const handleDeleteCourse = async (slug: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setLoading(true);
      const result = await coursesAPI.delete(slug);
      
      if (result.success) {
        // Refresh courses list
        const coursesRes = await coursesAPI.getAll();
        if (coursesRes.success && coursesRes.data) {
          setCourses(coursesRes.data.courses || []);
        }
      } else {
        alert("Failed to delete course: " + result.error);
      }
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    
    setLoading(true);
    const result = await coursesAPI.update(editingCourse.slug, {
      title: editingCourse.title,
      category: editingCourse.category,
      description: editingCourse.description,
      image: editingCourse.image,
      price: parseFloat(editingCourse.price) || 0,
      currency: editingCourse.currency || "ETB",
      duration: editingCourse.duration,
      level: editingCourse.level,
      instructor: editingCourse.instructor,
      technologies: editingCourse.technologies,
    });
    
    if (result.success) {
      setEditingCourse(null);
      // Refresh courses list
      const coursesRes = await coursesAPI.getAll();
      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data.courses || []);
      }
    } else {
      alert("Failed to update course: " + result.error);
    }
    setLoading(false);
  };

  // User handlers
  const handleDeleteUser = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setLoading(true);
      const result = await usersAPI.delete(userId.toString());
      
      if (result.success) {
        // Remove user from local state
        setUsers(prev => prev.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, users: prev.users - 1 }));
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user: " + result.error);
      }
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    const result = await usersAPI.update(editingUser.id.toString(), {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      status: editingUser.status,
      phone: editingUser.phone,
    });

    if (result.success) {
      // Update local state
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editingUser } : u));
      setEditingUser(null);
      alert("User updated successfully");
    } else {
      alert("Failed to update user: " + result.error);
    }
    setLoading(false);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) return null;

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Desktop Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 hidden lg:flex flex-col sticky top-0 h-screen z-40 ${
          isDark ? "bg-[#0f0f15] border-r border-white/5" : "bg-white border-r border-gray-200"
        }`}
      >
        {/* Logo */}
        <div className={`p-4 border-b flex items-center gap-3 ${isDark ? "border-white/5" : "border-gray-200"}`}>
          <img 
            src="/dreammorelogo.jpg" 
            alt="DreamMore" 
            className="w-9 h-9 object-cover rounded-full flex-shrink-0" 
          />
          {sidebarOpen && (
            <span className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>
              Dream<span className="text-[#f47822]">More</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/30" : "text-gray-400"}`}>
            {sidebarOpen && "Main Menu"}
          </p>
          {getSidebarItems(stats).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? "bg-[#f47822]/10 text-[#f47822] border border-[#f47822]/20"
                      : "bg-[#f47822]/10 text-[#f47822] border border-[#f47822]/20"
                    : isDark
                      ? "text-white/60 hover:text-white hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                {sidebarOpen && (item.badge || item.getBadge) && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? "bg-[#f47822]/20 text-[#f47822]" 
                      : isDark ? "bg-white/10 text-white/60" : "bg-gray-200 text-gray-600"
                  }`}>
                    {item.getBadge ? item.getBadge(courses) : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`p-3 border-t ${isDark ? "border-white/5" : "border-gray-200"}`}>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isDark 
                ? "text-red-400/60 hover:text-red-400 hover:bg-red-400/5" 
                : "text-red-500/60 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`w-64 h-full ${isDark ? "bg-[#0f0f15]" : "bg-white"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Logo */}
              <div className={`p-4 border-b flex items-center justify-between ${isDark ? "border-white/5" : "border-gray-200"}`}>
                <div className="flex items-center gap-2">
                  <img src="/dreammorelogo.jpg" alt="DreamMore" className="w-8 h-8 rounded-full" />
                  <span className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}>
                    Dream<span className="text-[#f47822]">More</span>
                  </span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className={`w-5 h-5 ${isDark ? "text-white/60" : "text-gray-500"}`} />
                </button>
              </div>
              {/* Mobile Nav */}
              <nav className="p-3 space-y-1">
                {getSidebarItems(stats).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#f47822]/10 text-[#f47822] border border-[#f47822]/20"
                          : isDark
                            ? "text-white/60 hover:text-white hover:bg-white/5"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {(item.badge || item.getBadge) && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-[#f47822]/20 text-[#f47822]" : isDark ? "bg-white/10" : "bg-gray-200"
                        }`}>
                          {item.getBadge ? item.getBadge(courses) : item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto min-h-screen ${isDark ? "" : "bg-gray-50"}`}>
        {/* Header */}
        <header className={`sticky top-0 z-30 px-4 sm:px-6 py-4 flex items-center justify-between ${
          isDark 
            ? "bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5" 
            : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
        }`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${isDark ? "hover:bg-white/5" : "hover:bg-gray-100"}`}
            >
              <Menu className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-700"}`} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`hidden lg:flex p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-100"}`}
            >
              <Menu className={`w-5 h-5 ${isDark ? "text-white/60" : "text-gray-500"}`} />
            </button>
            <div>
              <h1 className={`text-lg font-bold capitalize ${isDark ? "text-white" : "text-gray-900"}`}>{activeSection}</h1>
              <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>Admin Control Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${
              isDark ? "bg-white/5" : "bg-gray-100"
            }`}>
              <Search className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent text-sm outline-none w-32 lg:w-48 ${
                  isDark ? "text-white placeholder-white/40" : "text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? "hover:bg-white/5 text-white/60" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className={`relative p-2 rounded-xl transition-colors ${
              isDark ? "hover:bg-white/5 text-white/60" : "hover:bg-gray-100 text-gray-600"
            }`}>
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#f47822] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className={`flex items-center gap-2 pl-3 border-l ${isDark ? "border-white/10" : "border-gray-200"}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f47822] to-[#15142a] flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid - Dynamic from DB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Courses", value: stats.courses.toString(), change: "Live", icon: GraduationCap, color: "#7c3aed", trend: "neutral" },
                  { label: "Pending Applications", value: stats.pendingApplications.toString(), change: "Active", icon: FileText, color: "#f59e0b", trend: "up" },
                  { label: "Total Applications", value: stats.applications.toString(), change: "All time", icon: Users, color: "#f47822", trend: "neutral" },
                  { label: "Revenue (ETB)", value: `ETB ${Number(stats.totalRevenue).toLocaleString()}`, change: "Approved", icon: DollarSign, color: "#10b981", trend: "up" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  const isPositive = stat.trend === "up";
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                        isDark 
                          ? "glass border border-white/10" 
                          : "bg-white border border-gray-200 shadow-lg"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: stat.color + "15", border: `1px solid ${stat.color}30` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          isPositive 
                            ? "bg-green-500/10 text-green-500" 
                            : stat.trend === "down" 
                              ? "bg-red-500/10 text-red-500"
                              : isDark ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-500"
                        }`}>
                          <ArrowUpRight className={`w-3 h-3 ${!isPositive && stat.trend !== "neutral" ? "rotate-90" : ""}`} />
                          {stat.change}
                        </div>
                      </div>
                      <div className={`text-2xl sm:text-3xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {loading ? "-" : stat.value}
                      </div>
                      <div className={`text-xs sm:text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Applications */}
                <div className={`lg:col-span-2 rounded-2xl p-5 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#f47822]/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#f47822]" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Recent Applications</h3>
                        <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                          {loading ? "Loading..." : `${applications.filter(a => a.status === "pending").length} pending approval`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("applications")}
                      className="text-xs text-[#f47822] hover:text-[#e06b18] font-medium flex items-center gap-1"
                    >
                      View All <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-[#f47822]" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {applications
                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 5)
                        .map((app: any, i: number) => (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                              isDark ? "hover:bg-white/5 border border-white/5" : "hover:bg-gray-50 border border-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f47822]/30 to-[#f47822]/10 flex items-center justify-center text-[#f47822] text-sm font-black flex-shrink-0">
                                {(app.name || "?").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{app.name}</div>
                                <div className={`text-xs truncate ${isDark ? "text-white/50" : "text-gray-500"}`}>{app.course || app.course_title}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="text-right hidden sm:block">
                                <div className={`text-xs font-semibold ${isDark ? "text-white/80" : "text-gray-700"}`}>
                                  {app.amount ? `${Number(app.amount).toLocaleString()} ETB` : "—"}
                                </div>
                                <div className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-400"}`}>
                                  {app.created_at ? timeAgo(app.created_at) : ""}
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                                app.status === "approved"
                                  ? "bg-green-500/10 text-green-500"
                                  : app.status === "rejected"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-[#f47822]/10 text-[#f47822]"
                              }`}>{app.status}</span>
                              {app.status === "pending" && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => updateStatus(app.id, "approved")}
                                    className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => updateStatus(app.id, "rejected")}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      {applications.length === 0 && (
                        <div className={`text-center py-10 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                          No applications yet
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Activity Feed */}
                <div className={`rounded-2xl p-5 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Recent Activity</h3>
                        <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>Live feed</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        setActivitiesLoading(true);
                        const res = await fetch("/api/admin/recent-activity");
                        const data = await res.json();
                        if (data.success) setRecentActivities(data.activities || []);
                        setActivitiesLoading(false);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${activitiesLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {activitiesLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className={`text-center py-10 text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>
                      No recent activity
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {recentActivities.map((activity, i) => {
                        const dotColor =
                          activity.type === "approval" ? "bg-green-500" :
                          activity.type === "rejection" ? "bg-red-500" :
                          activity.type === "payment" ? "bg-emerald-500" :
                          activity.type === "submission" ? "bg-purple-500" : "bg-[#f47822]";
                        const actionLabel =
                          activity.type === "approval" ? "was approved for" :
                          activity.type === "rejection" ? "was rejected for" :
                          activity.type === "payment" ? "payment confirmed for" :
                          activity.type === "submission" ? "submitted" : "applied for";
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex gap-3 items-start"
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                            <div className="min-w-0">
                              <p className={`text-sm leading-snug ${isDark ? "text-white/90" : "text-gray-800"}`}>
                                <span className="font-semibold">{activity.userName}</span>{" "}
                                <span className={isDark ? "text-white/55" : "text-gray-500"}>{actionLabel}</span>{" "}
                                <span className="font-medium">{activity.detail}</span>
                              </p>
                              <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                                {timeAgo(activity.createdAt)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          {activeSection === "applications" && (
            <div className="space-y-4">
              {/* Header & Filters */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl ${
                isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f47822]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#f47822]" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>All Applications</h2>
                    <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{filteredApplications.length} total applications</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <Search className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`bg-transparent text-sm outline-none w-32 ${isDark ? "text-white placeholder-white/40" : "text-gray-900 placeholder-gray-500"}`}
                    />
                  </div>
                  
                  {/* Filter */}
                  <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <Filter className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`bg-transparent text-sm outline-none ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className={`rounded-2xl overflow-hidden ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Student</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Phone</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Course</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Payment</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Amount</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Date</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Status</th>
                        <th className={`text-left px-5 py-4 text-xs font-bold uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr 
                          key={app.id} 
                          className={`border-b transition-colors ${
                            isDark 
                              ? "border-white/5 hover:bg-white/5" 
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f47822]/20 to-[#15142a] flex items-center justify-center text-white text-sm font-bold">
                                {app.name.charAt(0)}
                              </div>
                              <div>
                                <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{app.name}</div>
                                <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{app.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className={`px-5 py-4 text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>{app.phone || "N/A"}</td>
                          <td className={`px-5 py-4 text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>{app.course_title || app.course}</td>
                          <td className={`px-5 py-4 text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>
                            {app.payment_method ? (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                app.payment_method === 'cbe' ? 'bg-blue-100 text-blue-700' :
                                app.payment_method === 'telebirr' ? 'bg-purple-100 text-purple-700' :
                                app.payment_method === 'chapa' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {app.payment_method.toUpperCase()}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className={`px-5 py-4 text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>ETB {app.amount || "0.00"}</td>
                          <td className={`px-5 py-4 text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : app.date}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                              app.status === "approved" 
                                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                : app.status === "rejected"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : app.status === "reupload"
                                    ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => setViewingApplication(app)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isDark 
                                    ? "bg-white/5 text-white/60 hover:text-white hover:bg-white/10" 
                                    : "bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                                }`} 
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {app.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => updateStatus(app.id, "approved", adminNotes)}
                                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors border border-green-500/20"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => updateStatus(app.id, "rejected", adminNotes)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => updateStatus(app.id, "under_review", adminNotes)}
                                    className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors border border-yellow-500/20"
                                    title="Mark Under Review"
                                  >
                                    <Clock className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredApplications.length === 0 && (
                  <div className={`text-center py-12 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No applications found matching your criteria</p>
                  </div>
                )}
              </div>

              {/* Image Lightbox */}
              {lightboxImg && (
                <div
                  className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                  onClick={() => setLightboxImg(null)}
                >
                  <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
                    <img
                      src={lightboxImg}
                      alt="Payment Screenshot"
                      className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={() => setLightboxImg(null)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <a
                      href={lightboxImg}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" /> Open original
                    </a>
                  </div>
                </div>
              )}

              {/* Application Detail Modal */}
              {viewingApplication && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
                  <div className="flex min-h-full items-start justify-center p-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`w-full max-w-4xl rounded-2xl ${
                      isDark ? "bg-[#15142a] border border-white/10" : "bg-white border border-gray-200"
                    } shadow-2xl`}
                  >
                    {/* Modal Header */}
                    <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
                      isDark ? "border-white/10 bg-[#15142a]" : "border-gray-200 bg-white"
                    }`}>
                      <div>
                        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                          Application Details
                        </h2>
                        <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                          ID: #{viewingApplication.id} • Applied on {new Date(viewingApplication.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setViewingApplication(null)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-gray-100 text-gray-500"
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Status Badge */}
                      <div className={`p-4 rounded-xl ${
                        isDark ? "bg-white/5" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>Current Status</p>
                            <span className={`inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full text-sm font-bold capitalize ${
                              viewingApplication.status === "approved" 
                                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                : viewingApplication.status === "rejected"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : viewingApplication.status === "under_review"
                                    ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}>
                              {viewingApplication.status === "pending" && <Clock className="w-4 h-4" />}
                              {viewingApplication.status === "approved" && <CheckCircle className="w-4 h-4" />}
                              {viewingApplication.status === "rejected" && <XCircle className="w-4 h-4" />}
                              {viewingApplication.status === "under_review" && <AlertCircle className="w-4 h-4" />}
                              {viewingApplication.status}
                            </span>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {viewingApplication.status !== "approved" && (
                              <button
                                onClick={() => {
                                  updateStatus(viewingApplication.id, "approved", adminNotes);
                                  setViewingApplication({ ...viewingApplication, status: "approved" });
                                }}
                                className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {viewingApplication.status !== "rejected" && (
                              <button
                                onClick={() => {
                                  updateStatus(viewingApplication.id, "rejected", adminNotes);
                                  setViewingApplication({ ...viewingApplication, status: "rejected" });
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Two Column Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Personal Info */}
                        <div className="space-y-4">
                          <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Personal Information</h3>
                          
                          <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                            <div className="space-y-3">
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Full Name</label>
                                <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{viewingApplication.name}</p>
                              </div>
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Email</label>
                                <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{viewingApplication.email}</p>
                              </div>
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Phone</label>
                                <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{viewingApplication.phone || "N/A"}</p>
                              </div>
                            </div>
                          </div>

                          <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Course Information</h3>
                          <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                            <div className="space-y-3">
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Course</label>
                                <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{viewingApplication.course_title || viewingApplication.course}</p>
                              </div>
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Amount Paid</label>
                                <p className={`font-semibold text-[#f47822]`}>ETB {viewingApplication.amount || "0.00"}</p>
                              </div>
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Payment Method</label>
                                <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {viewingApplication.payment_method ? viewingApplication.payment_method.toUpperCase() : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="space-y-4">
                          <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Background</h3>
                          
                          <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                            <div className="space-y-3">
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Education</label>
                                <p className={`text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{viewingApplication.education || "Not provided"}</p>
                              </div>
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Experience</label>
                                <p className={`text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{viewingApplication.experience || "Not provided"}</p>
                              </div>
                              <div>
                                <label className={`text-xs uppercase font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>Motivation</label>
                                <p className={`text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{viewingApplication.motivation || "Not provided"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Payment Screenshot */}
                          <div>
                            <h3 className={`font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Payment Screenshot</h3>
                            {viewingApplication.payment_screenshot ? (
                              <div className={`p-2 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                                <div
                                  className="relative group cursor-zoom-in"
                                  onClick={() => setLightboxImg(viewingApplication.payment_screenshot)}
                                >
                                  <img
                                    src={viewingApplication.payment_screenshot}
                                    alt="Payment Screenshot"
                                    className="w-full max-h-64 object-contain rounded-lg bg-black/10"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                                    }}
                                  />
                                  <div className="hidden text-center py-6 text-sm text-gray-400">
                                    Image failed to load —{" "}
                                    <a href={viewingApplication.payment_screenshot} target="_blank" rel="noopener noreferrer" className="text-[#f47822] underline">
                                      open directly
                                    </a>
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                    <span className="text-white font-semibold text-sm px-3 py-1.5 bg-black/60 rounded-lg">🔍 Click to expand</span>
                                  </div>
                                </div>
                                <a
                                  href={viewingApplication.payment_screenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#f47822] hover:underline"
                                >
                                  <ArrowUpRight className="w-3 h-3" /> Open in new tab
                                </a>
                              </div>
                            ) : (
                              <div className={`p-4 rounded-xl border-2 border-dashed text-center ${isDark ? "border-white/10 text-white/30" : "border-gray-200 text-gray-400"}`}>
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm font-medium">No screenshot uploaded</p>
                                <p className="text-xs mt-0.5 opacity-60">Student did not attach a payment proof</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <h3 className={`font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Admin Notes</h3>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add notes about this application..."
                          rows={3}
                          className={`w-full p-4 rounded-xl border resize-none ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users Management */}
          {activeSection === "users" && (
            <div className="space-y-4">
              {/* Header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl ${
                isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f47822]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#f47822]" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>User Management</h2>
                    <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{users.length} total users</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <Search className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className={`bg-transparent border-none outline-none text-sm w-40 ${isDark ? "text-white placeholder-white/30" : "text-gray-900 placeholder-gray-400"}`}
                    />
                  </div>
                  
                  {/* Role Filter */}
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      isDark 
                        ? "bg-white/5 border-white/10 text-white" 
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="admin">Admins</option>
                    <option value="instructor">Instructors</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className={`rounded-2xl overflow-hidden ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
                        <th className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>User</th>
                        <th className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>Role</th>
                        <th className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>Status</th>
                        <th className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>Joined</th>
                        <th className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center">
                            <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? "text-white/50" : "text-gray-400"}`} />
                            <p className={`text-sm mt-2 ${isDark ? "text-white/50" : "text-gray-500"}`}>Loading users...</p>
                          </td>
                        </tr>
                      ) : users.filter((u: any) => {
                        const matchesSearch = u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                                             u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                        const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
                        return matchesSearch && matchesRole;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center">
                            <Users className={`w-12 h-12 mx-auto mb-3 opacity-50 ${isDark ? "text-white/30" : "text-gray-400"}`} />
                            <p className={isDark ? "text-white/50" : "text-gray-500"}>No users found</p>
                          </td>
                        </tr>
                      ) : (
                        users.filter((u: any) => {
                          const matchesSearch = u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                                               u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                          const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
                          return matchesSearch && matchesRole;
                        }).map((user: any) => (
                          <tr 
                            key={user.id} 
                            className={`border-b transition-colors ${
                              isDark 
                                ? "border-white/5 hover:bg-white/5" 
                                : "border-gray-100 hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  isDark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-700"
                                }`}>
                                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{user.name || "N/A"}</p>
                                  <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin" 
                                  ? "bg-red-500/20 text-red-500" 
                                  : user.role === "instructor"
                                    ? "bg-blue-500/20 text-blue-500"
                                    : "bg-green-500/20 text-green-500"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "active" 
                                  ? "bg-green-500/20 text-green-500" 
                                  : "bg-red-500/20 text-red-500"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingUser(user)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isDark 
                                      ? "text-blue-400 hover:bg-blue-400/10" 
                                      : "text-blue-500 hover:bg-blue-50"
                                  }`}
                                  title="Edit User"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isDark 
                                      ? "text-red-400 hover:bg-red-400/10" 
                                      : "text-red-500 hover:bg-red-50"
                                  }`}
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          <AnimatePresence>
            {editingUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setEditingUser(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full max-w-md rounded-2xl p-6 ${
                    isDark ? "bg-[#1a1a24] border border-white/10" : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Edit User
                    </h2>
                    <button
                      onClick={() => setEditingUser(null)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? "text-white/60 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={editingUser.name || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 ${
                          isDark 
                            ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                            : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingUser.email || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 ${
                          isDark 
                            ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                            : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                        Role
                      </label>
                      <select
                        value={editingUser.role || "student"}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 ${
                          isDark 
                            ? "bg-white/5 border-white/10 text-white" 
                            : "bg-gray-50 border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                        Status
                      </label>
                      <select
                        value={editingUser.status || "active"}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 ${
                          isDark 
                            ? "bg-white/5 border-white/10 text-white" 
                            : "bg-gray-50 border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editingUser.phone || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 ${
                          isDark 
                            ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                            : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                        }`}
                        placeholder="+251..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                          isDark 
                            ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-[#f47822] text-white hover:bg-[#e06b18] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Courses Management */}
          {activeSection === "courses" && (
            <div className="space-y-6">
              {/* Header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl ${
                isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f47822]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#f47822]" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Course Management</h2>
                    <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{courses.length} courses available</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddCourse(!showAddCourse)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f47822] text-white text-sm font-semibold hover:bg-[#e06b18] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {showAddCourse ? "Cancel" : "Add Course"}
                </button>
              </div>

              {/* Add Course Form */}
              <AnimatePresence>
                {showAddCourse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-2xl p-6 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}
                  >
                    <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      <Plus className="w-5 h-5 text-[#f47822]" />
                      Add New Course
                    </h3>
                    
                    <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Course Title *
                        </label>
                        <input
                          type="text"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., Advanced Web Development"
                          required
                        />
                      </div>

                      {/* Skill/Category */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Skill / Category *
                        </label>
                        <select
                          value={newCourse.category}
                          onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="graphics-designing">Graphics Designing</option>
                          <option value="video-editing">Video Editing</option>
                          <option value="digital-marketing">Digital Marketing</option>
                          <option value="cinematography">Cinematography</option>
                          <option value="web-mobile-development">Web and Mobile App Development</option>
                          <option value="cpp-programming">Programming Language C++</option>
                          <option value="basic-computer">Basic Computer Skills</option>
                          <option value="computer-maintenance">Computer Maintenance</option>
                          <option value="mobile-maintenance">Mobile Maintenance</option>
                          <option value="ai-business">AI for Business</option>
                          <option value="cybersecurity">Cybersecurity & Data Safety</option>
                          <option value="sales-career">Sales & Career Development</option>
                          <option value="robotics-drone">Robotics & Drone Technology</option>
                          <option value="english-language">English Language</option>
                          <option value="ai-freelancing">AI-Powered Freelancing</option>
                          <option value="3d-modeling">3D Modeling & Product Prototyping</option>
                        </select>
                      </div>

                      {/* Price */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Price (ETB) *
                        </label>
                        <input
                          type="number"
                          value={newCourse.price}
                          onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., 4500"
                          required
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., 6 Months"
                          required
                        />
                      </div>

                      {/* Level */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Level <span className={isDark ? "text-white/40" : "text-gray-400"}>(optional)</span>
                        </label>
                        <select
                          value={newCourse.level}
                          onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      {/* Instructor */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Instructor Name <span className={isDark ? "text-white/40" : "text-gray-400"}>(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={newCourse.instructor}
                          onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., Samuel Tesfaye"
                        />
                      </div>

                      {/* Image URL */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Course Photo URL
                        </label>
                        <input
                          type="text"
                          value={newCourse.image}
                          onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="/images/courses/course-name.jpg or https://example.com/image.jpg"
                        />
                        {/* Image Preview */}
                        {newCourse.image && (
                          <div className="mt-3">
                            <p className={`text-xs mb-2 ${isDark ? "text-white/50" : "text-gray-500"}`}>Preview:</p>
                            <div className={`relative rounded-xl overflow-hidden w-48 h-32 ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"}`}>
                              <img
                                src={newCourse.image}
                                alt="Course preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="flex items-center justify-center h-full text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}">Failed to load image</div>`;
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description with Rich Text Editor */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Description * <span className={isDark ? "text-white/40" : "text-gray-400"}>(Rich Text)</span>
                        </label>
                        <RichTextEditor
                          value={newCourse.description}
                          onChange={(value) => setNewCourse({...newCourse, description: value})}
                          placeholder="Write a detailed description of the course with formatting, tables, lists..."
                          minHeight="300px"
                        />
                      </div>

                      {/* Technologies/Features */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Technologies / Tools (comma separated) *
                        </label>
                        <input
                          type="text"
                          value={newCourse.technologies}
                          onChange={(e) => setNewCourse({...newCourse, technologies: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="React, Node.js, MySQL, AWS"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCourse(false)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isDark 
                              ? "text-white/70 hover:text-white hover:bg-white/5" 
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f47822] text-white text-sm font-semibold hover:bg-[#e06b18] transition-all"
                        >
                          <Save className="w-4 h-4" />
                          Save Course
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Edit Course Form */}
              <AnimatePresence>
                {editingCourse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-2xl p-6 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}
                  >
                    <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      <Pencil className="w-5 h-5 text-[#f47822]" />
                      Edit Course
                    </h3>
                    
                    <form onSubmit={handleUpdateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Course Title *
                        </label>
                        <input
                          type="text"
                          value={editingCourse.title}
                          onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., Advanced Web Development"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Category *
                        </label>
                        <select
                          value={editingCourse.category}
                          onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="graphics-designing">Graphics Designing</option>
                          <option value="video-editing">Video Editing</option>
                          <option value="digital-marketing">Digital Marketing</option>
                          <option value="cinematography">Cinematography</option>
                          <option value="web-mobile-development">Web and Mobile App Development</option>
                          <option value="cpp-programming">Programming Language C++</option>
                          <option value="basic-computer">Basic Computer Skills</option>
                          <option value="computer-maintenance">Computer Maintenance</option>
                          <option value="mobile-maintenance">Mobile Maintenance</option>
                          <option value="ai-business">AI for Business</option>
                          <option value="cybersecurity">Cybersecurity & Data Safety</option>
                          <option value="sales-career">Sales & Career Development</option>
                          <option value="robotics-drone">Robotics & Drone Technology</option>
                          <option value="english-language">English Language</option>
                          <option value="ai-freelancing">AI-Powered Freelancing</option>
                          <option value="3d-modeling">3D Modeling & Product Prototyping</option>
                        </select>
                      </div>

                      {/* Price */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Price (ETB) *
                        </label>
                        <input
                          type="number"
                          value={editingCourse.price}
                          onChange={(e) => setEditingCourse({...editingCourse, price: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., 4500"
                          required
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={editingCourse.duration}
                          onChange={(e) => setEditingCourse({...editingCourse, duration: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., 12 weeks"
                          required
                        />
                      </div>

                      {/* Level */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Level *
                        </label>
                        <select
                          value={editingCourse.level}
                          onChange={(e) => setEditingCourse({...editingCourse, level: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        >
                          <option value="">Select level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>

                      {/* Instructor */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Instructor *
                        </label>
                        <input
                          type="text"
                          value={editingCourse.instructor}
                          onChange={(e) => setEditingCourse({...editingCourse, instructor: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="e.g., John Doe"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Description *
                        </label>
                        <textarea
                          value={editingCourse.description}
                          onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                          rows={3}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="Course description..."
                          required
                        />
                      </div>

                      {/* Image URL */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Course Image URL *
                        </label>
                        <input
                          type="url"
                          value={editingCourse.image}
                          onChange={(e) => setEditingCourse({...editingCourse, image: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      {/* Technologies */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                          Technologies / Tools (comma separated) *
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(editingCourse.technologies) ? editingCourse.technologies.join(', ') : editingCourse.technologies}
                          onChange={(e) => setEditingCourse({...editingCourse, technologies: e.target.value})}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                            isDark 
                              ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="React, Node.js, MySQL, AWS"
                          required
                        />
                      </div>

                      {/* Submit Buttons */}
                      <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isDark 
                              ? "text-white/70 hover:text-white hover:bg-white/5" 
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f47822] text-white text-sm font-semibold hover:bg-[#e06b18] transition-all"
                        >
                          <Save className="w-4 h-4" />
                          Update Course
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {courses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl overflow-hidden group ${
                      isDark 
                        ? "glass border border-white/10 hover:border-white/20" 
                        : "bg-white border border-gray-200 shadow-lg hover:shadow-xl"
                    } transition-all duration-300`}
                  >
                    {/* Course Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#f47822] text-white font-medium uppercase">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <h3 className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {course.title}
                      </h3>
                      <p className={`text-xs mb-3 line-clamp-2 ${isDark ? "text-white/60" : "text-gray-500"}`}>
                        {course.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-3 text-xs">
                        <span className={`flex items-center gap-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                        <span className={`flex items-center gap-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                          <GraduationCap className="w-3 h-3" />
                          {course.level}
                        </span>
                        <span className={`font-semibold ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
                          {course.currency} {course.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {course.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#f47822]/10 text-[#f47822] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {course.technologies.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#f47822]/10 text-[#f47822] font-medium">
                            +{course.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#f47822]/20">
                        <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
                          by {course.instructor}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteCourse(course.slug)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDark 
                                ? "text-red-400 hover:bg-red-400/10" 
                                : "text-red-500 hover:bg-red-50"
                            }`}
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCourse(course)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDark 
                                ? "text-blue-400 hover:bg-blue-400/10" 
                                : "text-blue-500 hover:bg-blue-50"
                            }`}
                            title="Edit Course"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}


          {/* ── PORTFOLIO ──────────────────────────────────────────── */}
          {activeSection === "portfolio" && (
            <PortfolioSection isDark={isDark} />
          )}


          {/* ── TESTIMONIALS ───────────────────────────────────────── */}
          {activeSection === "testimonials" && (
            <TestimonialsSection isDark={isDark} />
          )}

          {/* ── TEAM ───────────────────────────────────────────────── */}
          {activeSection === "team" && (
            <TeamSection isDark={isDark} />
          )}

          {/* ── COURSE ASSIGNMENT ──────────────────────────────── */}
          {activeSection === "course-assignment" && (
            <CourseAssignmentSection isDark={isDark} />
          )}

          {/* Payments Section */}
          {activeSection === "payments" && (
            <div className="space-y-6">
              {/* Header & Stats */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl ${
                isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"
              }`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Payment Overview
                  </h2>
                  <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                    Track revenue from approved student applications
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-5 py-3 rounded-xl ${isDark ? "bg-green-500/10" : "bg-green-50"}`}>
                    <p className={`text-xs uppercase font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
                      Total Revenue
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {stats.totalRevenue.toLocaleString()} <span className="text-sm">ETB</span>
                    </p>
                  </div>
                  <div className={`px-5 py-3 rounded-xl ${isDark ? "bg-[#f47822]/10" : "bg-orange-50"}`}>
                    <p className={`text-xs uppercase font-medium ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
                      Paid Students
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {stats.totalPaidStudents}
                    </p>
                  </div>
                </div>
              </div>

              {/* Paid Students Table */}
              <div className={`rounded-2xl overflow-hidden ${
                isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"
              }`}>
                <div className={`p-4 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Paid Students ({paidStudents.length})
                  </h3>
                </div>
                
                {paidStudents.length === 0 ? (
                  <div className="p-12 text-center">
                    <CreditCard className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-white/20" : "text-gray-300"}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      No Payments Yet
                    </h3>
                    <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
                      Approved student applications with payments will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                        <tr>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                            Student
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                            Course
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                            Amount
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                            Payment Method
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                            Date
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-200"}`}>
                        {paidStudents.map((student, index) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}
                          >
                            <td className="px-4 py-4">
                              <div>
                                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {student.name}
                                </p>
                                <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                                  {student.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                                {student.course}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                                {student.amount} ETB
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                student.paymentMethod === 'cbe' 
                                  ? isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                                  : student.paymentMethod === 'telebirr'
                                    ? isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                                    : isDark ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-700"
                              }`}>
                                {student.paymentMethod?.toUpperCase() || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                                {new Date(student.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                student.status === 'approved'
                                  ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                                  : isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {student.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LMS Management */}
          {activeSection === "lms" && (
            <div className="space-y-6">
              {/* Header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>LMS Management</h2>
                    <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>Courses, enrolled students &amp; content overview</p>
                  </div>
                </div>
                <button
                  onClick={() => { setLmsData(null); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/70" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {lmsLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : !lmsData ? (
                <div className={`text-center py-16 rounded-2xl ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200"}`}>
                  <Monitor className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className={isDark ? "text-white/40" : "text-gray-400"}>Failed to load LMS data</p>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Courses", value: lmsData.summary.totalCourses, icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10" },
                      { label: "Enrolled Students", value: lmsData.summary.totalEnrolled, icon: Users2, color: "text-blue-500", bg: "bg-blue-500/10" },
                      { label: "Total Videos", value: lmsData.summary.totalVideos, icon: Play, color: "text-[#f47822]", bg: "bg-[#f47822]/10" },
                      { label: "Assignments", value: lmsData.summary.totalAssignments, icon: ClipboardList, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className={`rounded-2xl p-5 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"}`}>
                          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                            <Icon className={`w-5 h-5 ${s.color}`} />
                          </div>
                          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{s.value}</div>
                          <div className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-gray-500"}`}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tabs */}
                  <div className={`flex gap-1 p-1 rounded-xl w-fit ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    {(['overview', 'students'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setLmsTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          lmsTab === tab
                            ? isDark ? "bg-white/10 text-white" : "bg-white text-gray-900 shadow-sm"
                            : isDark ? "text-white/50 hover:text-white/70" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab === 'overview' ? 'Course Overview' : 'Enrolled Students'}
                      </button>
                    ))}
                  </div>

                  {/* Course Overview Tab */}
                  {lmsTab === 'overview' && (
                    <div className="space-y-4">
                      {lmsData.courses.length === 0 ? (
                        <div className={`text-center py-16 rounded-2xl ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200"}`}>
                          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className={isDark ? "text-white/40" : "text-gray-400"}>No courses found</p>
                        </div>
                      ) : (
                        lmsData.courses.map((course: any, i: number) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`rounded-2xl p-5 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              {/* Course Info */}
                              <div className="flex items-start gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{course.title}</h3>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                      course.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                                    }`}>{course.status}</span>
                                  </div>
                                  <div className={`flex flex-wrap items-center gap-3 text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{course.instructor || 'No instructor'}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration || '—'}</span>
                                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{course.level}</span>
                                    <span className={`font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>ETB {Number(course.price).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Actions */}
                              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                <Link
                                  href={`/lms/course/${course.slug}`}
                                  target="_blank"
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/70" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                                >
                                  <Eye className="w-3.5 h-3.5" /> Preview
                                </Link>
                                <button
                                  onClick={() => openLmsMgr(course)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f47822]/10 text-[#f47822] hover:bg-[#f47822]/20 transition-colors border border-[#f47822]/20"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add LMS
                                </button>
                              </div>
                            </div>

                            {/* Content Stats Row */}
                            <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-5 gap-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}>
                              {[
                                { label: 'Enrolled', value: course.stats.enrolled, icon: Users2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { label: 'Phases', value: course.stats.phases, icon: Layers, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                                { label: 'Weeks', value: course.stats.weeks, icon: BookMarked, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                { label: 'Videos', value: course.stats.videos, icon: Play, color: 'text-[#f47822]', bg: 'bg-[#f47822]/10' },
                                { label: 'Assignments', value: course.stats.assignments, icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                              ].map((stat) => {
                                const Icon = stat.icon;
                                return (
                                  <div key={stat.label} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                                    <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                      <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                                    </div>
                                    <div>
                                      <div className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stat.value}</div>
                                      <div className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-400"}`}>{stat.label}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* No content warning */}
                            {course.stats.phases === 0 && (
                              <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                No LMS content added yet — add phases, weeks and videos via the course editor
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Enrolled Students Tab */}
                  {lmsTab === 'students' && (
                    <div className={`rounded-2xl overflow-hidden ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"}`}>
                      {/* Filter bar */}
                      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
                        <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-600"}`}>
                          {lmsData.enrolledStudents.length} enrolled student{lmsData.enrolledStudents.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-2">
                          <select
                            value={lmsCourseFilter}
                            onChange={(e) => setLmsCourseFilter(e.target.value)}
                            className={`text-xs px-3 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-700"}`}
                          >
                            <option value="all">All Courses</option>
                            {lmsData.courses.map((c: any) => (
                              <option key={c.id} value={String(c.id)}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {lmsData.enrolledStudents.length === 0 ? (
                        <div className={`text-center py-16 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                          <Users2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No enrolled students yet</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className={isDark ? "border-b border-white/10" : "border-b border-gray-100"}>
                                {["Student", "Course", "Amount Paid", "Enrolled", ""].map((h) => (
                                  <th key={h} className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-400"}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {lmsData.enrolledStudents
                                .filter((s: any) => lmsCourseFilter === 'all' || String(s.courseId) === lmsCourseFilter)
                                .map((s: any, i: number) => (
                                  <motion.tr
                                    key={s.applicationId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`transition-colors ${isDark ? "hover:bg-white/5 border-b border-white/5" : "hover:bg-gray-50 border-b border-gray-100"}`}
                                  >
                                    <td className="px-5 py-3.5">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-xs font-bold text-blue-500 flex-shrink-0">
                                          {(s.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{s.name}</div>
                                          <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>{s.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className={`px-5 py-3.5 text-sm ${isDark ? "text-white/70" : "text-gray-700"}`}>{s.courseTitle}</td>
                                    <td className={`px-5 py-3.5 text-sm font-semibold ${isDark ? "text-white/80" : "text-gray-900"}`}>ETB {Number(s.amount).toLocaleString()}</td>
                                    <td className={`px-5 py-3.5 text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
                                      {s.enrolledAt ? new Date(s.enrolledAt).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                      <Link
                                        href={`/lms/course/${s.courseSlug}`}
                                        target="_blank"
                                        className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                                      >
                                        View LMS <ChevronRight className="w-3 h-3" />
                                      </Link>
                                    </td>
                                  </motion.tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* LMS Content Manager Modal */}
          {lmsMgrCourse && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
              <div className="flex min-h-full items-start justify-center p-4 py-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`w-full max-w-3xl rounded-2xl shadow-2xl ${isDark ? "bg-[#15142a] border border-white/10" : "bg-white border border-gray-200"}`}
                >
                  {/* Header */}
                  <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b rounded-t-2xl ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
                    <div>
                      <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        LMS Content — {lmsMgrCourse.title}
                      </h2>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                        Manage phases, weeks, videos, notes &amp; assignments
                      </p>
                    </div>
                    <button onClick={closeLmsMgr} className={`p-2 rounded-lg ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-gray-100 text-gray-500"}`}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {lmsMgrLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-7 h-7 animate-spin text-[#f47822]" />
                      </div>
                    ) : (
                      <>
                        {/* Phases list */}
                        {lmsMgrTree.length === 0 && !showPhaseForm && (
                          <div className={`text-center py-10 rounded-xl border-2 border-dashed ${isDark ? "border-white/10 text-white/30" : "border-gray-200 text-gray-400"}`}>
                            <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-medium">No phases yet</p>
                            <p className="text-xs opacity-60 mt-0.5">Add your first phase below</p>
                          </div>
                        )}

                        {lmsMgrTree.map((phase: any) => (
                          <div key={phase.id} className={`rounded-xl border overflow-hidden ${isDark ? "border-white/10 bg-white/3" : "border-gray-200 bg-gray-50"}`}>
                            {/* Phase header */}
                            <div
                              onClick={() => setLmsMgrExpanded(lmsMgrExpanded === phase.id ? null : phase.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${isDark ? "hover:bg-white/5" : "hover:bg-gray-100"}`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                <Layers className="w-4 h-4 text-violet-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                                  Phase {phase.phase_number}: {phase.title}
                                </div>
                                <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
                                  {phase.weeks?.length || 0} weeks · {phase.duration_weeks}w duration
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); lmsMgrPost({ action: 'delete_phase', id: phase.id }); }}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isDark ? "text-white/40" : "text-gray-400"} ${lmsMgrExpanded === phase.id ? "rotate-180" : ""}`} />
                              </div>
                            </div>

                            {/* Phase body */}
                            {lmsMgrExpanded === phase.id && (
                              <div className={`px-4 pb-4 pt-2 border-t space-y-3 ${isDark ? "border-white/10" : "border-gray-200"}`}>
                                {/* Weeks */}
                                {phase.weeks?.map((week: any) => (
                                  <div key={week.id} className={`rounded-lg border overflow-hidden ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
                                    <div
                                      onClick={() => setLmsMgrExpandedWeek(lmsMgrExpandedWeek === week.id ? null : week.id)}
                                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                        <BookMarked className="w-3.5 h-3.5 text-amber-500" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                                          Week {week.week_number}: {week.title}
                                        </div>
                                        <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
                                          {week.videos?.length || 0} videos · {week.notes?.length || 0} notes · {week.assignments?.length || 0} assignments
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); lmsMgrPost({ action: 'delete_week', id: week.id }); }}
                                          className="p-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDark ? "text-white/30" : "text-gray-400"} ${lmsMgrExpandedWeek === week.id ? "rotate-180" : ""}`} />
                                      </div>
                                    </div>

                                    {lmsMgrExpandedWeek === week.id && (
                                      <div className={`px-3 pb-3 border-t space-y-3 ${isDark ? "border-white/10" : "border-gray-100"}`}>
                                        {/* Videos */}
                                        <div className="pt-2">
                                          <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>Videos</div>
                                          {week.videos?.map((v: any) => (
                                            <div key={v.id} className={`flex items-center justify-between py-1.5 px-2 rounded-lg mb-1 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                                              <div className="flex items-center gap-2 min-w-0">
                                                <Play className="w-3.5 h-3.5 text-[#f47822] flex-shrink-0" />
                                                <span className={`text-xs font-medium truncate ${isDark ? "text-white/80" : "text-gray-700"}`}>{v.title}</span>
                                                {v.duration_minutes && <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{v.duration_minutes}min</span>}
                                              </div>
                                              <button onClick={() => lmsMgrPost({ action: 'delete_video', id: v.id })} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                          ))}
                                          {showVideoForm === week.id ? (
                                            <div className={`mt-2 p-3 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-200"}`}>
                                              <div className="grid grid-cols-1 gap-2">
                                                <input placeholder="Video title *" value={videoForm.title} onChange={e => setVideoForm(f => ({...f, title: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                <input placeholder="YouTube URL or video link *" value={videoForm.video_url} onChange={e => setVideoForm(f => ({...f, video_url: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                <input placeholder="Thumbnail URL (optional)" value={videoForm.thumbnail_url} onChange={e => setVideoForm(f => ({...f, thumbnail_url: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                <div className="grid grid-cols-2 gap-2">
                                                  <input placeholder="Duration (min)" type="number" value={videoForm.duration_minutes} onChange={e => setVideoForm(f => ({...f, duration_minutes: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                  <input placeholder="Description" value={videoForm.description} onChange={e => setVideoForm(f => ({...f, description: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                </div>
                                              </div>
                                              {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                              <div className="flex gap-2 mt-2">
                                                <button disabled={formSaving} onClick={async () => { const ok = await lmsMgrPost({ action: 'add_video', week_id: week.id, ...videoForm, duration_minutes: videoForm.duration_minutes ? Number(videoForm.duration_minutes) : null }); if (ok) { setShowVideoForm(null); setVideoForm({ title: '', description: '', video_url: '', thumbnail_url: '', duration_minutes: '' }); }}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f47822] text-white text-xs font-semibold disabled:opacity-50">
                                                  {formSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                                                </button>
                                                <button onClick={() => setShowVideoForm(null)} className={`px-3 py-1.5 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-500"}`}>Cancel</button>
                                              </div>
                                            </div>
                                          ) : (
                                            <button onClick={() => { setShowVideoForm(week.id); setShowNoteForm(null); setShowAssignForm(null); }} className={`flex items-center gap-1.5 text-xs mt-1 px-2.5 py-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-[#f47822]" : "bg-[#f47822]/5 hover:bg-[#f47822]/10 text-[#f47822]"}`}>
                                              <Plus className="w-3 h-3" /> Add Video
                                            </button>
                                          )}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                          <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>Notes / PDFs</div>
                                          {week.notes?.map((n: any) => (
                                            <div key={n.id} className={`flex items-center justify-between py-1.5 px-2 rounded-lg mb-1 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                                              <div className="flex items-center gap-2 min-w-0">
                                                <FileArchive className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                <span className={`text-xs font-medium truncate ${isDark ? "text-white/80" : "text-gray-700"}`}>{n.title}</span>
                                                {n.file_size_mb && <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{n.file_size_mb}MB</span>}
                                              </div>
                                              <button onClick={() => lmsMgrPost({ action: 'delete_note', id: n.id })} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                          ))}
                                          {showNoteForm === week.id ? (
                                            <div className={`mt-2 p-3 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-emerald-50 border-emerald-200"}`}>
                                              <div className="grid grid-cols-1 gap-2">
                                                <input placeholder="Note title *" value={noteForm.title} onChange={e => setNoteForm(f => ({...f, title: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                <input placeholder="Description (optional)" value={noteForm.description} onChange={e => setNoteForm(f => ({...f, description: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                {/* File upload area */}
                                                <input
                                                  ref={noteFileInputRef}
                                                  type="file"
                                                  accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                                                  className="hidden"
                                                  onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setNoteUploading(true);
                                                    setFormError('');
                                                    try {
                                                      const fd = new FormData();
                                                      fd.append('file', file);
                                                      const res = await fetch('/api/upload/lms-note', { method: 'POST', body: fd });
                                                      const data = await res.json();
                                                      if (!data.success) { setFormError(data.error || 'Upload failed'); return; }
                                                      setNoteForm(f => ({ ...f, pdf_url: data.url, file_size_mb: String(data.sizeMb) }));
                                                      setNoteUploadedFile({ name: data.originalName, sizeMb: data.sizeMb });
                                                    } catch { setFormError('Upload failed'); }
                                                    finally { setNoteUploading(false); }
                                                  }}
                                                />
                                                <div
                                                  onClick={() => noteFileInputRef.current?.click()}
                                                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                                                    noteUploadedFile
                                                      ? isDark ? "border-emerald-500/40 bg-emerald-500/10" : "border-emerald-300 bg-emerald-50"
                                                      : isDark ? "border-white/10 hover:border-white/20" : "border-gray-200 hover:border-emerald-300"
                                                  }`}
                                                >
                                                  {noteUploading ? (
                                                    <><Loader2 className="w-5 h-5 animate-spin text-emerald-500" /><span className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>Uploading…</span></>
                                                  ) : noteUploadedFile ? (
                                                    <><FileArchive className="w-5 h-5 text-emerald-500" /><span className={`text-xs font-medium truncate max-w-full px-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>{noteUploadedFile.name}</span><span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{noteUploadedFile.sizeMb} MB · click to replace</span></>
                                                  ) : (
                                                    <><Upload className="w-5 h-5 text-emerald-500 opacity-60" /><span className={`text-xs font-medium ${isDark ? "text-white/50" : "text-gray-500"}`}>Click to upload file</span><span className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>PDF · DOCX · PPT · PPTX · Images — max 20 MB</span></>
                                                  )}
                                                </div>
                                              </div>
                                              {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                              <div className="flex gap-2 mt-2">
                                                <button disabled={formSaving || noteUploading || !noteForm.pdf_url} onClick={async () => { const ok = await lmsMgrPost({ action: 'add_note', week_id: week.id, ...noteForm, file_size_mb: noteForm.file_size_mb ? Number(noteForm.file_size_mb) : null }); if (ok) { setShowNoteForm(null); setNoteForm({ title: '', description: '', pdf_url: '', file_size_mb: '' }); setNoteUploadedFile(null); }}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:opacity-50">
                                                  {formSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                                                </button>
                                                <button onClick={() => { setShowNoteForm(null); setNoteUploadedFile(null); setNoteForm({ title: '', description: '', pdf_url: '', file_size_mb: '' }); }} className={`px-3 py-1.5 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-500"}`}>Cancel</button>
                                              </div>
                                            </div>
                                          ) : (
                                            <button onClick={() => { setShowNoteForm(week.id); setShowVideoForm(null); setShowAssignForm(null); }} className={`flex items-center gap-1.5 text-xs mt-1 px-2.5 py-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-emerald-400" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"}`}>
                                              <Plus className="w-3 h-3" /> Add Note
                                            </button>
                                          )}
                                        </div>

                                        {/* Assignments */}
                                        <div>
                                          <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>Assignments</div>
                                          {week.assignments?.map((a: any) => (
                                            <div key={a.id} className={`flex items-center justify-between py-1.5 px-2 rounded-lg mb-1 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                                              <div className="flex items-center gap-2 min-w-0">
                                                <ClipboardList className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                                <span className={`text-xs font-medium truncate ${isDark ? "text-white/80" : "text-gray-700"}`}>{a.title}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${a.assignment_type === 'quiz' ? 'bg-violet-100 text-violet-600' : a.assignment_type === 'practice' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{a.assignment_type}</span>
                                              </div>
                                              <button onClick={() => lmsMgrPost({ action: 'delete_assignment', id: a.id })} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                          ))}
                                          {showAssignForm === week.id ? (
                                            <div className={`mt-2 p-3 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-200"}`}>
                                              <div className="grid grid-cols-1 gap-2">
                                                <input placeholder="Assignment title *" value={assignForm.title} onChange={e => setAssignForm(f => ({...f, title: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                <textarea placeholder="Description" rows={2} value={assignForm.description} onChange={e => setAssignForm(f => ({...f, description: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full resize-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                <div className="grid grid-cols-3 gap-2">
                                                  <select value={assignForm.assignment_type} onChange={e => setAssignForm(f => ({...f, assignment_type: e.target.value}))} className={`text-xs px-2 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
                                                    <option value="practice">Practice</option>
                                                    <option value="assignment">Assignment</option>
                                                    <option value="quiz">Quiz</option>
                                                  </select>
                                                  <input type="date" value={assignForm.deadline} onChange={e => setAssignForm(f => ({...f, deadline: e.target.value}))} className={`text-xs px-2 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-800"}`} />
                                                  <input placeholder="Max score" type="number" value={assignForm.max_score} onChange={e => setAssignForm(f => ({...f, max_score: e.target.value}))} className={`text-xs px-2 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                                </div>
                                              </div>
                                              {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                              <div className="flex gap-2 mt-2">
                                                <button disabled={formSaving} onClick={async () => { const ok = await lmsMgrPost({ action: 'add_assignment', week_id: week.id, ...assignForm, max_score: Number(assignForm.max_score) || 100 }); if (ok) { setShowAssignForm(null); setAssignForm({ title: '', description: '', assignment_type: 'assignment', deadline: '', max_score: '100' }); }}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold disabled:opacity-50">
                                                  {formSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                                                </button>
                                                <button onClick={() => setShowAssignForm(null)} className={`px-3 py-1.5 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-500"}`}>Cancel</button>
                                              </div>
                                            </div>
                                          ) : (
                                            <button onClick={() => { setShowAssignForm(week.id); setShowVideoForm(null); setShowNoteForm(null); }} className={`flex items-center gap-1.5 text-xs mt-1 px-2.5 py-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-blue-400" : "bg-blue-50 hover:bg-blue-100 text-blue-600"}`}>
                                              <Plus className="w-3 h-3" /> Add Assignment
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {/* Add Week form */}
                                {showWeekForm === phase.id ? (
                                  <div className={`mt-2 p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-amber-50 border-amber-200"}`}>
                                    <p className={`text-xs font-bold mb-2 ${isDark ? "text-white/60" : "text-amber-700"}`}>New Week</p>
                                    <div className="space-y-2">
                                      <input placeholder="Week title *" value={weekForm.title} onChange={e => setWeekForm(f => ({...f, title: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                      <input placeholder="Description" value={weekForm.description} onChange={e => setWeekForm(f => ({...f, description: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                      <input placeholder="Learning topics (comma separated)" value={weekForm.learning_topics} onChange={e => setWeekForm(f => ({...f, learning_topics: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                    </div>
                                    {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                    <div className="flex gap-2 mt-3">
                                      <button disabled={formSaving} onClick={async () => { const ok = await lmsMgrPost({ action: 'add_week', phase_id: phase.id, ...weekForm, learning_topics: weekForm.learning_topics.split(',').map(s => s.trim()).filter(Boolean) }); if (ok) { setShowWeekForm(null); setWeekForm({ title: '', description: '', learning_topics: '' }); }}} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold disabled:opacity-50">
                                        {formSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save Week
                                      </button>
                                      <button onClick={() => setShowWeekForm(null)} className={`px-4 py-2 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-500"}`}>Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={() => { setShowWeekForm(phase.id); setLmsMgrExpandedWeek(null); }} className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg w-full justify-center border border-dashed transition-colors ${isDark ? "border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-500/30" : "border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300"}`}>
                                    <Plus className="w-3.5 h-3.5" /> Add Week to this Phase
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add Phase form */}
                        {showPhaseForm ? (
                          <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-violet-50 border-violet-200"}`}>
                            <p className={`text-xs font-bold mb-2 ${isDark ? "text-white/60" : "text-violet-700"}`}>New Phase</p>
                            <div className="space-y-2">
                              <input placeholder="Phase title *" value={phaseForm.title} onChange={e => setPhaseForm(f => ({...f, title: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                              <input placeholder="Description" value={phaseForm.description} onChange={e => setPhaseForm(f => ({...f, description: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                              <div className="grid grid-cols-2 gap-2">
                                <input placeholder="Duration (weeks)" type="number" min={1} value={phaseForm.duration_weeks} onChange={e => setPhaseForm(f => ({...f, duration_weeks: Number(e.target.value)}))} className={`text-xs px-3 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                                <input placeholder="Learning objectives (comma separated)" value={phaseForm.learning_objectives} onChange={e => setPhaseForm(f => ({...f, learning_objectives: e.target.value}))} className={`text-xs px-3 py-2 rounded-lg border outline-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`} />
                              </div>
                            </div>
                            {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                            <div className="flex gap-2 mt-3">
                              <button disabled={formSaving} onClick={async () => { const ok = await lmsMgrPost({ action: 'add_phase', course_id: lmsMgrCourse.id, ...phaseForm, learning_objectives: phaseForm.learning_objectives.split(',').map(s => s.trim()).filter(Boolean) }); if (ok) { setShowPhaseForm(false); setPhaseForm({ title: '', description: '', duration_weeks: 1, learning_objectives: '' }); }}} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-500 text-white text-xs font-semibold disabled:opacity-50">
                                {formSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save Phase
                              </button>
                              <button onClick={() => setShowPhaseForm(false)} className={`px-4 py-2 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-500"}`}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowPhaseForm(true)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-[#f47822]/30 text-[#f47822] text-sm font-semibold hover:bg-[#f47822]/5 transition-colors">
                            <Plus className="w-4 h-4" /> Add New Phase
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* ── CERTIFICATES ─────────────────────────────────────────── */}
          {activeSection === "certificates" && (
            <CertificatesSection isDark={isDark} />
          )}

          {/* Other sections placeholder */}
         {!["dashboard", "applications", "courses", "portfolio", "testimonials", "payments", "lms", "certificates", "team", "course-assignment"].includes(activeSection) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex flex-col items-center justify-center py-24 text-center rounded-2xl ${
                isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"
              }`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${
                isDark ? "bg-white/5" : "bg-gray-100"
              }`}>
                <Settings className={`w-10 h-10 ${isDark ? "text-white/20" : "text-gray-300"}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 capitalize ${isDark ? "text-white" : "text-gray-900"}`}>
                {activeSection}
              </h3>
              <p className={`text-sm max-w-xs mb-6 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                This section is part of Phase 3 development. Backend integration required.
              </p>
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f47822] text-white font-medium hover:bg-[#e06b18] transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── CERTIFICATES SECTION ────────────────────────────────────────────────────

function CertificatesSection({ isDark }: { isDark: boolean }) {
  const [certs, setCerts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, revoked: 0, courses_with_certs: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Issue form
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState({ course_id: "", user_id: "", notes: "", expires_at: "" });
  const [eligibleStudents, setEligibleStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState("");

  // Revoke
  const [revokeId, setRevokeId] = useState<number | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (courseFilter !== "all") params.set("courseId", courseFilter);
      const res = await fetch(`/api/admin/certificates?${params}`);
      const data = await res.json();
      if (data.success) {
        setCerts(data.certificates || []);
        setStats(data.stats);
        setCourses(data.courses || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCerts(); }, [statusFilter, courseFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchCerts(); };

  const loadStudents = async (courseId: string) => {
    if (!courseId) { setEligibleStudents([]); return; }
    setStudentsLoading(true);
    try {
      const res = await fetch(`/api/admin/certificates/students?courseId=${courseId}`);
      const data = await res.json();
      if (data.success) setEligibleStudents(data.students || []);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleIssueCourseChange = (courseId: string) => {
    setIssueForm(f => ({ ...f, course_id: courseId, user_id: "" }));
    loadStudents(courseId);
  };

  const handleIssue = async () => {
    if (!issueForm.course_id || !issueForm.user_id) { setIssueError("Select a course and student."); return; }
    setIssuing(true); setIssueError("");
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...issueForm, course_id: Number(issueForm.course_id), user_id: Number(issueForm.user_id) }),
      });
      const data = await res.json();
      if (!data.success) { setIssueError(data.error || "Failed"); return; }
      setShowIssueForm(false);
      setIssueForm({ course_id: "", user_id: "", notes: "", expires_at: "" });
      setEligibleStudents([]);
      fetchCerts();
    } finally { setIssuing(false); }
  };

  const handleRevoke = async () => {
    if (!revokeId) return;
    setRevoking(true);
    try {
      const params = new URLSearchParams({ id: String(revokeId) });
      if (revokeReason) params.set("reason", revokeReason);
      await fetch(`/api/admin/certificates?${params}`, { method: "DELETE" });
      setRevokeId(null); setRevokeReason("");
      fetchCerts();
    } finally { setRevoking(false); }
  };

  const base = isDark ? "bg-[#15142a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900";
  const sub = isDark ? "text-white/50" : "text-gray-500";
  const inputCls = `text-sm px-3 py-2 rounded-xl border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Certificates</h2>
          <p className={`text-sm mt-0.5 ${sub}`}>Issue and manage student completion certificates</p>
        </div>
        <button
          onClick={() => { setShowIssueForm(true); setIssueError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors"
        >
          <Plus className="w-4 h-4" /> Issue Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Issued", value: stats.total, icon: Award, color: "text-[#f47822]", bg: "bg-orange-50", darkBg: "bg-orange-500/10" },
          { label: "Active", value: stats.active, icon: BadgeCheck, color: "text-emerald-600", bg: "bg-emerald-50", darkBg: "bg-emerald-500/10" },
          { label: "Revoked", value: stats.revoked, icon: ShieldOff, color: "text-red-500", bg: "bg-red-50", darkBg: "bg-red-500/10" },
          { label: "Courses", value: stats.courses_with_certs, icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50", darkBg: "bg-violet-500/10" },
        ].map(({ label, value, icon: Icon, color, bg, darkBg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${base}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? darkBg : bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</div>
                <div className={`text-xs ${sub}`}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-4 ${base}`}>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
            <input
              placeholder="Search by student, course, cert number…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${inputCls} w-auto`}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className={`${inputCls} w-auto`}>
            <option value="all">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 bg-[#f47822] text-white rounded-xl text-sm font-semibold hover:bg-[#e06b18] transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${base}`}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-[#f47822]" />
          </div>
        ) : certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
              <Award className={`w-8 h-8 ${isDark ? "text-white/20" : "text-gray-300"}`} />
            </div>
            <p className={`font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>No certificates found</p>
            <p className={`text-sm mt-1 ${sub}`}>Issue your first certificate to a student</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? "bg-white/5" : "bg-gray-50"}>
                <tr>
                  {["Cert #", "Student", "Course", "Issued", "Status", "Actions"].map(h => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold ${sub}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certs.map(cert => (
                  <tr key={cert.id} className={`transition-colors ${isDark ? "border-white/5 hover:bg-white/3" : "hover:bg-gray-50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-[#f47822] flex-shrink-0" />
                        <span className={`text-xs font-mono font-semibold ${isDark ? "text-white/80" : "text-gray-700"}`}>{cert.certificate_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${isDark ? "bg-white/10 text-white" : "bg-orange-100 text-[#f47822]"}`}>
                          {cert.student_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{cert.student_name}</div>
                          <div className={`text-xs truncate ${sub}`}>{cert.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm truncate max-w-[160px] block ${isDark ? "text-white/80" : "text-gray-700"}`}>{cert.course_title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className={`w-3.5 h-3.5 ${sub}`} />
                        <span className={`text-xs ${sub}`}>{new Date(cert.issued_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {cert.status === "active" ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold w-fit border border-emerald-100">
                          <BadgeCheck className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold w-fit border border-red-100">
                          <ShieldOff className="w-3.5 h-3.5" /> Revoked
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {cert.status === "active" && (
                        <button
                          onClick={() => { setRevokeId(cert.id); setRevokeReason(""); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors border border-red-100"
                        >
                          <ShieldOff className="w-3.5 h-3.5" /> Revoke
                        </button>
                      )}
                      {cert.status === "revoked" && cert.revoke_reason && (
                        <span className={`text-xs italic ${sub}`}>{cert.revoke_reason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue Modal */}
      {showIssueForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Issue Certificate</h3>
                <p className={`text-xs mt-0.5 ${sub}`}>Select a course and student to issue a certificate</p>
              </div>
              <button onClick={() => setShowIssueForm(false)} className={`p-2 rounded-lg ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`text-xs font-semibold mb-1 block ${sub}`}>Course *</label>
                <select value={issueForm.course_id} onChange={e => handleIssueCourseChange(e.target.value)} className={inputCls}>
                  <option value="">Select course…</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className={`text-xs font-semibold mb-1 block ${sub}`}>Student *</label>
                {studentsLoading ? (
                  <div className="flex items-center gap-2 py-2"><Loader2 className="w-4 h-4 animate-spin text-[#f47822]" /><span className={`text-xs ${sub}`}>Loading students…</span></div>
                ) : (
                  <select value={issueForm.user_id} onChange={e => setIssueForm(f => ({ ...f, user_id: e.target.value }))} className={inputCls} disabled={!issueForm.course_id}>
                    <option value="">Select student…</option>
                    {eligibleStudents.map(s => (
                      <option key={s.id} value={s.id} disabled={!!s.has_cert}>
                        {s.name} ({s.email}){s.has_cert ? " — cert issued" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className={`text-xs font-semibold mb-1 block ${sub}`}>Expires (optional)</label>
                <input type="date" value={issueForm.expires_at} onChange={e => setIssueForm(f => ({ ...f, expires_at: e.target.value }))} className={inputCls} />
              </div>

              <div>
                <label className={`text-xs font-semibold mb-1 block ${sub}`}>Notes (optional)</label>
                <textarea rows={2} placeholder="e.g. Graduated with distinction" value={issueForm.notes} onChange={e => setIssueForm(f => ({ ...f, notes: e.target.value }))} className={`${inputCls} resize-none`} />
              </div>

              {issueError && <p className="text-xs text-red-500 font-medium">{issueError}</p>}

              <div className="flex gap-2 pt-1">
                <button onClick={handleIssue} disabled={issuing} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f47822] text-white font-semibold text-sm hover:bg-[#e06b18] disabled:opacity-50 transition-colors">
                  {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {issuing ? "Issuing…" : "Issue Certificate"}
                </button>
                <button onClick={() => setShowIssueForm(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Revoke Confirm Modal */}
      {revokeId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <ShieldOff className="w-6 h-6 text-red-500" />
            </div>
            <h3 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Revoke Certificate?</h3>
            <p className={`text-sm mb-4 ${sub}`}>This action cannot be undone. The student will lose their certificate status.</p>
            <textarea
              rows={2}
              placeholder="Reason for revoking (optional)"
              value={revokeReason}
              onChange={e => setRevokeReason(e.target.value)}
              className={`${inputCls} resize-none mb-4`}
            />
            <div className="flex gap-2">
              <button onClick={handleRevoke} disabled={revoking} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-50">
                {revoking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4" />}
                {revoking ? "Revoking…" : "Revoke"}
              </button>
              <button onClick={() => setRevokeId(null)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

// ── PORTFOLIO SECTION ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "", category: "", description: "",
  technologies: "", image: "", live_url: "", case_study_url: "", is_active: true,
};

function PortfolioSection({ isDark }: { isDark: boolean }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Image upload
  const [imgUploading, setImgUploading] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const base = isDark ? "bg-[#15142a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900";
  const sub = isDark ? "text-white/50" : "text-gray-500";
  const inputCls = `text-sm px-3 py-2 rounded-xl border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (catFilter !== "all") p.set("category", catFilter);
      if (statusFilter !== "all") p.set("status", statusFilter);
      const res = await fetch(`/api/admin/portfolio?${p}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
        setCategories(data.categories || []);
        setStats(data.stats);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, [catFilter, statusFilter]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title || "",
      category: p.category || "",
      description: p.description || "",
      technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
      image: p.image || "",
      live_url: p.live_url || "",
      case_study_url: p.case_study_url || "",
      is_active: !!p.is_active,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/portfolio", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) { setFormError(data.error || "Image upload failed"); return; }
      setForm(f => ({ ...f, image: data.url }));
    } catch { setFormError("Image upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    setSaving(true); setFormError("");
    const payload = {
      ...form,
      technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
    };
    try {
      const url = editId ? `/api/admin/portfolio?id=${editId}` : "/api/admin/portfolio";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) { setFormError(data.error || "Failed to save"); return; }
      setShowForm(false);
      fetchProjects();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/portfolio?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    setDeleting(false);
    fetchProjects();
  };

  const handleToggleActive = async (p: any) => {
    await fetch(`/api/admin/portfolio?id=${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies : [], is_active: !p.is_active }),
    });
    fetchProjects();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Portfolio</h2>
          <p className={`text-sm mt-0.5 ${sub}`}>Manage agency projects, case studies and client work</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Projects", value: stats.total, icon: FolderOpen, color: "text-[#f47822]", bg: "bg-orange-50", dbg: "bg-orange-500/10" },
          { label: "Published", value: stats.active, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", dbg: "bg-emerald-500/10" },
          { label: "Hidden", value: stats.inactive, icon: Eye, color: "text-gray-400", bg: "bg-gray-100", dbg: "bg-white/5" },
        ].map(({ label, value, icon: Icon, color, bg, dbg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${base}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? dbg : bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</div>
                <div className={`text-xs ${sub}`}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-4 ${base}`}>
        <form onSubmit={e => { e.preventDefault(); fetchProjects(); }} className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
            <input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className={`${inputCls} w-auto`}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${inputCls} w-auto`}>
            <option value="all">All Status</option>
            <option value="active">Published</option>
            <option value="inactive">Hidden</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-[#f47822] text-white rounded-xl text-sm font-semibold hover:bg-[#e06b18] transition-colors">Search</button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#f47822]" /></div>
      ) : projects.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-24 text-center rounded-2xl border ${base}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
            <FolderOpen className={`w-8 h-8 ${isDark ? "text-white/20" : "text-gray-300"}`} />
          </div>
          <p className={`font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>No projects found</p>
          <p className={`text-sm mt-1 ${sub}`}>Add your first portfolio project</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border overflow-hidden flex flex-col ${base} ${!p.is_active ? "opacity-60" : ""}`}>
              {/* Image */}
              <div className={`relative h-44 overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className={`w-10 h-10 ${isDark ? "text-white/10" : "text-gray-300"}`} />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.is_active ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}`}>
                    {p.is_active ? "Published" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`font-bold text-sm leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>{p.title}</h3>
                  {p.category && (
                    <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${isDark ? "bg-white/10 text-white/60" : "bg-orange-50 text-[#f47822] border border-orange-100"}`}>
                      {p.category}
                    </span>
                  )}
                </div>
                {p.description && <p className={`text-xs line-clamp-2 mb-3 ${sub}`}>{p.description}</p>}

                {/* Tech tags */}
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.technologies.slice(0, 4).map((t: string) => (
                      <span key={t} className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${isDark ? "bg-white/5 text-white/50" : "bg-gray-100 text-gray-500"}`}>{t}</span>
                    ))}
                    {p.technologies.length > 4 && <span className={`text-[10px] px-2 py-0.5 rounded-lg ${sub}`}>+{p.technologies.length - 4}</span>}
                  </div>
                )}

                {/* Links + actions */}
                <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2 flex-wrap" style={{ borderColor: isDark ? "rgba(255,255,255,0.07)" : "#f3f4f6" }}>
                  <div className="flex gap-2">
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                        <Globe className="w-3 h-3" /> Live
                      </a>
                    )}
                    {p.case_study_url && (
                      <a href={p.case_study_url} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                        <ExternalLink className="w-3 h-3" /> Case Study
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <button onClick={() => handleToggleActive(p)} title={p.is_active ? "Hide" : "Publish"}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}>
                      {p.is_active ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(p)}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(p.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-2xl shadow-2xl border my-4 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{editId ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${sub}`}>Cover Image</label>
                <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                <div onClick={() => imgInputRef.current?.click()}
                  className={`relative h-36 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden flex items-center justify-center transition-colors ${form.image ? "border-transparent" : isDark ? "border-white/10 hover:border-white/20" : "border-gray-200 hover:border-orange-300"}`}>
                  {form.image ? (
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  ) : imgUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#f47822]" />
                  ) : (
                    <div className="text-center">
                      <Upload className={`w-6 h-6 mx-auto mb-1 ${isDark ? "text-white/20" : "text-gray-300"}`} />
                      <span className={`text-xs ${sub}`}>Click to upload image</span>
                    </div>
                  )}
                  {form.image && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Click to replace</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Title *</label>
                  <input placeholder="Project title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Category</label>
                  <input placeholder="e.g. Web Design" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className={`text-xs font-semibold block mb-1 ${sub}`}>Status</label>
                    <select value={form.is_active ? "1" : "0"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))} className={inputCls}>
                      <option value="1">Published</option>
                      <option value="0">Hidden</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Description</label>
                  <textarea rows={3} placeholder="Short project description…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputCls} resize-none`} />
                </div>
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Technologies <span className="font-normal opacity-60">(comma separated)</span></label>
                  <input placeholder="React, Node.js, MySQL…" value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Live URL</label>
                  <input placeholder="https://…" value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Case Study URL</label>
                  <input placeholder="https://…" value={form.case_study_url} onChange={e => setForm(f => ({ ...f, case_study_url: e.target.value }))} className={inputCls} />
                </div>
              </div>

              {formError && <p className="text-xs text-red-500 font-medium">{formError}</p>}

              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f47822] text-white font-semibold text-sm hover:bg-[#e06b18] disabled:opacity-50 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : editId ? "Update Project" : "Add Project"}
                </button>
                <button onClick={() => setShowForm(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Delete Project?</h3>
            <p className={`text-sm mb-5 ${sub}`}>This will permanently remove the project from your portfolio.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-50">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button onClick={() => setDeleteId(null)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

// ── TESTIMONIALS SECTION ────────────────────────────────────────────────────

const EMPTY_TFORM = { name: "", company: "", role: "", content: "", rating: "5", image: "", is_active: true };

function TestimonialsSection({ isDark }: { isDark: boolean }) {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, hidden: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_TFORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const base = isDark ? "bg-[#15142a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900";
  const sub = isDark ? "text-white/50" : "text-gray-500";
  const inputCls = `text-sm px-3 py-2 rounded-xl border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) { setTestimonials(data.testimonials || []); setStats(data.stats); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = testimonials.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.company || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.content || "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditId(null); setForm({ ...EMPTY_TFORM }); setFormError(""); setShowForm(true); };
  const openEdit = (t: any) => {
    setEditId(t.id);
    setForm({ name: t.name, company: t.company || "", role: t.role || "", content: t.content, rating: String(t.rating ?? 5), image: t.image || "", is_active: !!t.is_active });
    setFormError(""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) { setFormError("Name and content are required."); return; }
    setSaving(true); setFormError("");
    try {
      const url = editId ? `/api/admin/testimonials?id=${editId}` : "/api/admin/testimonials";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, rating: Number(form.rating) }) });
      const data = await res.json();
      if (!data.success) { setFormError(data.error || "Failed"); return; }
      setShowForm(false); fetchAll();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/testimonials?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null); setDeleting(false); fetchAll();
  };

  const handleToggle = async (t: any) => {
    await fetch(`/api/admin/testimonials?id=${t.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...t, is_active: !t.is_active }) });
    fetchAll();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Testimonials</h2>
          <p className={`text-sm mt-0.5 ${sub}`}>Manage client reviews and success stories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, icon: MessageSquare, color: "text-[#f47822]", bg: "bg-orange-50", dbg: "bg-orange-500/10" },
          { label: "Published", value: stats.active, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", dbg: "bg-emerald-500/10" },
          { label: "Hidden", value: stats.hidden, icon: Eye, color: "text-gray-400", bg: "bg-gray-100", dbg: "bg-white/5" },
        ].map(({ label, value, icon: Icon, color, bg, dbg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${base}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? dbg : bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</div>
                <div className={`text-xs ${sub}`}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={`rounded-2xl border p-4 ${base}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
          <input placeholder="Search by name, company, or content…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-[#f47822]" /></div>
      ) : filtered.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 text-center rounded-2xl border ${base}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
            <MessageSquare className={`w-8 h-8 ${isDark ? "text-white/20" : "text-gray-300"}`} />
          </div>
          <p className={`font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>No testimonials yet</p>
          <p className={`text-sm mt-1 ${sub}`}>Add your first client review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 flex flex-col gap-3 ${base} ${!t.is_active ? "opacity-55" : ""}`}>
              {/* Stars + status */}
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`w-3.5 h-3.5 ${n <= (t.rating ?? 5) ? "text-yellow-400 fill-yellow-400" : isDark ? "text-white/15" : "text-gray-200"}`} />
                  ))}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${t.is_active ? "bg-emerald-50 text-emerald-600" : isDark ? "bg-white/5 text-white/30" : "bg-gray-100 text-gray-400"}`}>
                  {t.is_active ? "Published" : "Hidden"}
                </span>
              </div>
              {/* Content */}
              <p className={`text-sm leading-relaxed line-clamp-3 italic ${sub}`}>&ldquo;{t.content}&rdquo;</p>
              {/* Author */}
              <div className="flex items-center gap-2.5 mt-auto">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f47822] to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{t.name}</div>
                  <div className={`text-xs truncate ${sub}`}>{[t.role, t.company].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
              {/* Actions */}
              <div className={`flex items-center justify-end gap-1.5 pt-2 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <button onClick={() => handleToggle(t)} title={t.is_active ? "Hide" : "Publish"}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}>
                  {t.is_active ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(t)}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteId(t.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl shadow-2xl border ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{editId ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Client Name *</label>
                  <input placeholder="e.g. Abebe Kebede" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Company</label>
                  <input placeholder="e.g. TechCo" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Role</label>
                  <input placeholder="e.g. CEO" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Review *</label>
                  <textarea rows={3} placeholder="Client review…" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Rating</label>
                  <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} className={inputCls}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Status</label>
                  <select value={form.is_active ? "1" : "0"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))} className={inputCls}>
                    <option value="1">Published</option>
                    <option value="0">Hidden</option>
                  </select>
                </div>
              </div>
              {formError && <p className="text-xs text-red-500 font-medium">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f47822] text-white font-semibold text-sm hover:bg-[#e06b18] disabled:opacity-50 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : editId ? "Update" : "Add Testimonial"}
                </button>
                <button onClick={() => setShowForm(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Delete Testimonial?</h3>
            <p className={`text-sm mb-5 ${sub}`}>This will permanently remove this review.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-50">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button onClick={() => setDeleteId(null)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

// ── TEAM SECTION ─────────────────────────────────────────────────────────────

const EMPTY_MEMBER = { name: "", position: "", bio: "", specialties: "", image: "", linkedin: "", twitter: "", order_index: "0", is_active: true };

function TeamSection({ isDark }: { isDark: boolean }) {
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, hidden: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_MEMBER });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [imgUploading, setImgUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const base = isDark ? "bg-[#15142a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900";
  const sub = isDark ? "text-white/50" : "text-gray-500";
  const inputCls = `text-sm px-3 py-2 rounded-xl border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) { setMembers(data.members || []); setStats(data.stats); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = members.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.position || "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditId(null); setForm({ ...EMPTY_MEMBER }); setFormError(""); setShowForm(true); };
  const openEdit = (m: any) => {
    setEditId(m.id);
    setForm({
      name: m.name, position: m.position || "", bio: m.bio || "",
      specialties: Array.isArray(m.specialties) ? m.specialties.join(", ") : "",
      image: m.image || "", linkedin: m.linkedin || "", twitter: m.twitter || "",
      order_index: String(m.order_index ?? 0), is_active: !!m.is_active,
    });
    setFormError(""); setShowForm(true);
  };

  const handleImgUpload = async (file: File) => {
    setImgUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload/team", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setForm(f => ({ ...f, image: data.url }));
      else setFormError(data.error || "Upload failed");
    } catch { setFormError("Upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    setSaving(true); setFormError("");
    const payload = { ...form, specialties: form.specialties.split(",").map(s => s.trim()).filter(Boolean), order_index: Number(form.order_index) };
    try {
      const url = editId ? `/api/admin/team?id=${editId}` : "/api/admin/team";
      const res = await fetch(url, { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) { setFormError(data.error || "Failed"); return; }
      setShowForm(false); fetchAll();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    await fetch(`/api/admin/team?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null); setDeleting(false); fetchAll();
  };

  const handleToggle = async (m: any) => {
    await fetch(`/api/admin/team?id=${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...m, specialties: Array.isArray(m.specialties) ? m.specialties : [], is_active: !m.is_active }) });
    fetchAll();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Team Members</h2>
          <p className={`text-sm mt-0.5 ${sub}`}>Manage the team shown on the homepage and team page</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Users2, color: "text-[#f47822]", bg: "bg-orange-50", dbg: "bg-orange-500/10" },
          { label: "Visible", value: stats.active, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", dbg: "bg-emerald-500/10" },
          { label: "Hidden", value: stats.hidden, icon: Eye, color: "text-gray-400", bg: "bg-gray-100", dbg: "bg-white/5" },
        ].map(({ label, value, icon: Icon, color, bg, dbg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${base}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? dbg : bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</div>
                <div className={`text-xs ${sub}`}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={`rounded-2xl border p-4 ${base}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
          <input placeholder="Search by name or position…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-[#f47822]" /></div>
      ) : filtered.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 text-center rounded-2xl border ${base}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
            <Users2 className={`w-8 h-8 ${isDark ? "text-white/20" : "text-gray-300"}`} />
          </div>
          <p className={`font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>No team members yet</p>
          <p className={`text-sm mt-1 ${sub}`}>Add your first team member</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 flex flex-col gap-3 ${base} ${!m.is_active ? "opacity-55" : ""}`}>
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-white"
                      style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{m.name}</div>
                  <div className="text-xs font-semibold" style={{ color: "#f47822" }}>{m.position}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block ${m.is_active ? "bg-emerald-50 text-emerald-600" : isDark ? "bg-white/5 text-white/30" : "bg-gray-100 text-gray-400"}`}>
                    {m.is_active ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
              {/* Bio */}
              {m.bio && <p className={`text-xs line-clamp-2 ${sub}`}>{m.bio}</p>}
              {/* Specialties */}
              {m.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {m.specialties.slice(0, 3).map((s: string) => (
                    <span key={s} className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${isDark ? "bg-white/5 text-white/50" : "bg-gray-100 text-gray-500"}`}>{s}</span>
                  ))}
                  {m.specialties.length > 3 && <span className={`text-[10px] px-2 py-0.5 ${sub}`}>+{m.specialties.length - 3}</span>}
                </div>
              )}
              {/* Social + Actions */}
              <div className={`flex items-center justify-between pt-2 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <div className="flex gap-2">
                  {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}><ExternalLink className="w-3.5 h-3.5" /></a>}
                  {m.twitter && <a href={m.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}><Share2 className="w-3.5 h-3.5" /></a>}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleToggle(m)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}>
                    {m.is_active ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(m)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-gray-100 text-gray-400"}`}><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-2xl shadow-2xl border my-4 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{editId ? "Edit Member" : "Add Team Member"}</h3>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo upload */}
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${sub}`}>Photo</label>
                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImgUpload(f); }} />
                <div onClick={() => imgRef.current?.click()}
                  className={`relative h-28 w-28 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden flex items-center justify-center transition-colors ${form.image ? "border-transparent" : isDark ? "border-white/10 hover:border-white/20" : "border-gray-200 hover:border-orange-300"}`}>
                  {form.image ? (
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  ) : imgUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#f47822]" />
                  ) : (
                    <div className="text-center">
                      <Upload className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-white/20" : "text-gray-300"}`} />
                      <span className={`text-[10px] ${sub}`}>Upload</span>
                    </div>
                  )}
                  {form.image && <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-[10px] font-semibold">Replace</span></div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Full Name *</label>
                  <input placeholder="e.g. Biruk Alemu" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Position</label>
                  <input placeholder="e.g. CEO & Founder" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Display Order</label>
                  <input type="number" min="0" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: e.target.value }))} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Bio</label>
                  <textarea rows={2} placeholder="Short bio…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className={`${inputCls} resize-none`} />
                </div>
                <div className="col-span-2">
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Specialties <span className="font-normal opacity-60">(comma separated)</span></label>
                  <input placeholder="Strategy, Leadership, AI…" value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>LinkedIn URL</label>
                  <input placeholder="https://linkedin.com/in/…" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Twitter URL</label>
                  <input placeholder="https://twitter.com/…" value={form.twitter} onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${sub}`}>Status</label>
                  <select value={form.is_active ? "1" : "0"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "1" }))} className={inputCls}>
                    <option value="1">Visible</option>
                    <option value="0">Hidden</option>
                  </select>
                </div>
              </div>

              {formError && <p className="text-xs text-red-500 font-medium">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f47822] text-white font-semibold text-sm hover:bg-[#e06b18] disabled:opacity-50 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : editId ? "Update Member" : "Add Member"}
                </button>
                <button onClick={() => setShowForm(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200"}`}>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Remove Team Member?</h3>
            <p className={`text-sm mb-5 ${sub}`}>This will permanently remove them from the team.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-50">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Removing…" : "Remove"}
              </button>
              <button onClick={() => setDeleteId(null)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

// ── COURSE ASSIGNMENT SECTION ─────────────────────────────────────────────────

function CourseAssignmentSection({ isDark }: { isDark: boolean }) {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const base = isDark ? "bg-[#15142a] border-white/10" : "bg-white border-gray-200";
  const sub = isDark ? "text-white/50" : "text-gray-500";
  const inputCls = `text-sm px-3 py-2 rounded-xl border outline-none w-full ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-800"}`;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/instructor-assignments");
      const data = await res.json();
      if (data.success) {
        setInstructors(data.instructors || []);
        setCourses(data.courses || []);
        setAssignments(data.assignments || []);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const getAssignedCourseIds = (instructorId: number) =>
    assignments.filter((a: any) => a.instructor_id === instructorId).map((a: any) => a.course_id);

  const handleSelectInstructor = (inst: any) => {
    setSelectedInstructor(inst);
    setSelectedCourseIds(getAssignedCourseIds(inst.id));
    setCourseSearch("");
    setSaved(false);
  };

  const toggleCourse = (courseId: number) => {
    setSelectedCourseIds(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedInstructor) return;
    setSaving(true); setSaved(false);
    try {
      const res = await fetch("/api/admin/instructor-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructor_id: selectedInstructor.id, course_ids: selectedCourseIds }),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); fetchAll(); }
    } finally { setSaving(false); }
  };

  const filteredInstructors = instructors.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCourses = courses.filter(c =>
    !courseSearch || c.title.toLowerCase().includes(courseSearch.toLowerCase()) || (c.category || "").toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Course Assignment</h2>
        <p className={`text-sm mt-0.5 ${sub}`}>Assign LMS courses to instructors for access-controlled management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Instructors", value: instructors.length, icon: UserCheck2, color: "text-[#f47822]", bg: "bg-orange-50", dbg: "bg-orange-500/10" },
          { label: "Courses", value: courses.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", dbg: "bg-blue-500/10" },
          { label: "Assignments", value: assignments.length, icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50", dbg: "bg-emerald-500/10" },
        ].map(({ label, value, icon: Icon, color, bg, dbg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${base}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? dbg : bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</div>
                <div className={`text-xs ${sub}`}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Instructor List */}
        <div className={`rounded-2xl border ${base} flex flex-col`}>
          <div className={`px-5 py-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
            <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Instructors</h3>
            <div className="relative mt-2">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${sub}`} />
              <input placeholder="Search instructors…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-8 py-1.5`} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[420px] p-2 space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-[#f47822]" /></div>
            ) : filteredInstructors.length === 0 ? (
              <div className={`text-center py-12 text-sm ${sub}`}>
                <UserCheck2 className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-white/10" : "text-gray-200"}`} />
                <p>{instructors.length === 0 ? "No instructors found." : "No results."}</p>
                {instructors.length === 0 && <p className="text-xs mt-1 opacity-60">Create users with role = instructor first.</p>}
              </div>
            ) : filteredInstructors.map(inst => {
              const assignedCount = getAssignedCourseIds(inst.id).length;
              const isSelected = selectedInstructor?.id === inst.id;
              return (
                <button key={inst.id} onClick={() => handleSelectInstructor(inst)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? isDark ? "bg-orange-500/15 border border-orange-500/30" : "bg-orange-50 border border-orange-200"
                      : isDark ? "hover:bg-white/5 border border-transparent" : "hover:bg-gray-50 border border-transparent"
                  }`}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                    {inst.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{inst.name}</div>
                    <div className={`text-xs truncate ${sub}`}>{inst.email}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    assignedCount > 0 ? "bg-emerald-50 text-emerald-600" : isDark ? "bg-white/5 text-white/30" : "bg-gray-100 text-gray-400"
                  }`}>
                    {assignedCount} course{assignedCount !== 1 ? "s" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Course assignment panel */}
        <div className={`rounded-2xl border ${base} flex flex-col`}>
          {!selectedInstructor ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
              <ClipboardCheck className={`w-10 h-10 mb-3 ${isDark ? "text-white/10" : "text-gray-200"}`} />
              <p className={`font-semibold text-sm ${sub}`}>Select an instructor</p>
              <p className={`text-xs mt-1 ${sub}`}>Choose an instructor from the left to manage their course assignments</p>
            </div>
          ) : (
            <>
              <div className={`px-5 py-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                      {selectedInstructor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedInstructor.name}</div>
                      <div className={`text-xs ${sub}`}>{selectedCourseIds.length} course{selectedCourseIds.length !== 1 ? "s" : ""} selected</div>
                    </div>
                  </div>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f47822] text-white rounded-lg text-xs font-semibold hover:bg-[#e06b18] disabled:opacity-50 transition-colors">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
                  </button>
                </div>
                <div className="relative mt-2">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${sub}`} />
                  <input placeholder="Filter courses…" value={courseSearch} onChange={e => setCourseSearch(e.target.value)} className={`${inputCls} pl-8 py-1.5`} />
                </div>
              </div>
              <div className={`flex items-center gap-2 px-5 py-2 border-b ${isDark ? "border-white/5" : "border-gray-50"}`}>
                <button onClick={() => setSelectedCourseIds(courses.map(c => c.id))}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${isDark ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  Select All
                </button>
                <button onClick={() => setSelectedCourseIds([])}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${isDark ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  Clear All
                </button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[360px] p-2 space-y-1">
                {filteredCourses.length === 0 ? (
                  <div className={`text-center py-10 text-sm ${sub}`}>No courses found.</div>
                ) : filteredCourses.map(course => {
                  const isChecked = selectedCourseIds.includes(course.id);
                  return (
                    <button key={course.id} onClick={() => toggleCourse(course.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isChecked
                          ? isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"
                          : isDark ? "hover:bg-white/5 border border-transparent" : "hover:bg-gray-50 border border-transparent"
                      }`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked ? "bg-emerald-500 border-emerald-500" : isDark ? "border-white/20" : "border-gray-300"
                      }`}>
                        {isChecked && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{course.title}</div>
                        <div className={`text-xs ${sub}`}>{[course.category, course.level].filter(Boolean).join(" · ")}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                        course.status === "active" ? "bg-emerald-50 text-emerald-600" : isDark ? "bg-white/5 text-white/30" : "bg-gray-100 text-gray-400"
                      }`}>{course.status}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Assignment overview table */}
      {!loading && instructors.length > 0 && (
        <div className={`rounded-2xl border ${base}`}>
          <div className={`px-5 py-4 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
            <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Assignment Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
                  {["Instructor", "Email", "Assigned Courses", "Status"].map(h => (
                    <th key={h} className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {instructors.map(inst => {
                  const count = getAssignedCourseIds(inst.id).length;
                  return (
                    <tr key={inst.id} onClick={() => handleSelectInstructor(inst)}
                      className={`cursor-pointer border-b transition-colors ${isDark ? "border-white/5 hover:bg-white/3" : "border-gray-50 hover:bg-gray-50"}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                            {inst.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{inst.name}</span>
                        </div>
                      </td>
                      <td className={`px-5 py-3 text-xs ${sub}`}>{inst.email}</td>
                      <td className="px-5 py-3">
                        <span className={`font-bold text-sm ${count > 0 ? "text-emerald-600" : sub}`}>{count}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${inst.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {inst.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </motion.div>
  );
}
