"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CreditCard, CheckCircle, Clock, Globe, Award, ArrowLeft, Loader2 } from "lucide-react";
import { fetchCourses } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

function ApplyContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("course");
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch course data from API
  useEffect(() => {
    const loadCourse = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const courses = await fetchCourses();
        const found = courses.find((c: any) => c.slug === slug);
        if (found) {
          setCourse(found);
          // Save course data to localStorage for payment page
          localStorage.setItem("applyData", JSON.stringify(found));
        }
      } catch (error) {
        console.error("Failed to load course:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [slug]);

  const steps = [
    { icon: BookOpen, label: "Review", desc: "Review course details", done: true },
    { icon: CheckCircle, label: "Confirm", desc: "Confirm your details", done: true },
    { icon: CreditCard, label: "Payment", desc: "Complete payment", done: false },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark && <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#f47822]/5 rounded-full blur-[120px]" />}
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-10" : "opacity-5"}`} />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f47822]/20 text-[#f47822] border border-[#f47822]/30 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Application
          </span>
          
          <h1 className={`text-3xl sm:text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            {course ? `Apply for ${course.title}` : "Apply for a Course"}
          </h1>
          <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
            You&apos;re one step away from starting your journey
          </p>
        </motion.div>

        {/* Progress Steps - Modern Design */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;
            return (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {/* Step Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step.done
                      ? "bg-[#f47822]/15 border-2 border-[#f47822]"
                      : isDark
                        ? "bg-white/5 border-2 border-white/20"
                        : "bg-gray-100 border-2 border-gray-300"
                  }`}>
                    <Icon className={`w-5 h-5 ${step.done ? "text-[#f47822]" : isDark ? "text-white/50" : "text-gray-400"}`} />
                  </div>
                  {/* Label */}
                  <div className="text-center">
                    <div className={`text-xs font-bold ${step.done ? "text-[#f47822]" : isDark ? "text-white" : "text-gray-700"}`}>
                      {step.label}
                    </div>
                    <div className={`text-[10px] hidden sm:block max-w-[80px] text-center ${isDark ? "text-white/40" : "text-gray-500"}`}>
                      {step.desc}
                    </div>
                  </div>
                </div>
                {/* Connector Line */}
                {!isLast && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${step.done ? "bg-[#f47822]/50" : isDark ? "bg-white/10" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Course Summary Card */}
        {course && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 mb-6 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}
          >
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#f47822]/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#f47822]" />
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/60" : "text-gray-500"}`}>
                Your Selected Course
              </h3>
            </div>

            {/* Course Details */}
            <div className="flex items-start gap-4">
              {/* Course Icon/Emoji */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${isDark ? "bg-[#f47822]/10 border border-[#f47822]/20" : "bg-orange-50 border border-orange-100"}`}>
                💻
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{course.title}</h4>
                
                {/* Course Meta */}
                <div className={`flex flex-wrap gap-2 text-xs mb-4 ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <Globe className="w-3 h-3" />
                    {course.language}
                  </span>
                  {course.certificate && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#f47822]/10 text-[#f47822]">
                      <Award className="w-3 h-3" />
                      Certified
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>
                    ETB {course.price.toLocaleString()}
                  </span>
                  <span className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>one-time payment</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 mb-6 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}
        >
          {/* Card Header */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#f47822]/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#f47822]" />
            </div>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Payment Instructions
            </h3>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: 1, text: "Pay the course fee using CBE Bank or Telebirr" },
              { step: 2, text: "Take a screenshot of the payment confirmation" },
              { step: 3, text: "Upload the screenshot on the payment verification page" },
              { step: 4, text: "Wait for admin approval (within 24 hours)" },
              { step: 5, text: "Once approved, your LMS dashboard will be unlocked" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f47822]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#f47822]">{item.step}</span>
                </div>
                <span className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className={`mt-5 pt-4 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
            <p className={`text-xs mb-3 ${isDark ? "text-white/50" : "text-gray-500"}`}>Accepted Payment Methods</p>
            <div className="flex flex-wrap gap-2">
              {["CBE Bank", "Telebirr"].map((method) => (
                <span 
                  key={method}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#f47822]/10 text-[#f47822] border border-[#f47822]/20"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            href={course ? `/academy/course/${course.slug}` : "/academy"} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isDark 
                ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" 
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={() => router.push(`/payment${course ? `?course=${course.slug}` : ""}`)}
            disabled={loading || !course}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security Note */}
        <p className={`text-center text-xs mt-6 ${isDark ? "text-white/40" : "text-gray-400"}`}>
          🔒 Secure application process. Your information is protected.
        </p>
      </div>
    </div>
  );
}

export default function ApplyClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
