"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, Loader2, CreditCard, Smartphone, Building2, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useSearchParams, useRouter } from "next/navigation";
import { applicationsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const paymentMethods = [
  {
    id: "cbe",
    name: "CBE Bank",
    icon: Building2,
    color: "#00d4ff",
    account: "1000123456789",
    holder: "DreamMore Academy PLC",
    instructions: "Transfer to CBE account and take a screenshot of the confirmation.",
  },
  {
    id: "telebirr",
    name: "Telebirr",
    icon: Smartphone,
    color: "#7c3aed",
    account: "+251 911 000 000",
    holder: "DreamMore",
    instructions: "Send payment via Telebirr and screenshot the transaction confirmation.",
  },
  {
    id: "chapa",
    name: "Chapa",
    icon: CreditCard,
    color: "#10b981",
    account: "Pay via Chapa checkout",
    holder: "DreamMore Academy",
    instructions: "Use Chapa online payment gateway. Screenshot payment receipt.",
  },
];

function PaymentContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");
  
  const [selectedMethod, setSelectedMethod] = useState("cbe");
  const [file, setFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);

  // Get user and course info on mount
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=/payment${courseSlug ? `?course=${courseSlug}` : ""}`);
      return;
    }

    // Get course info from localStorage (set by apply page)
    const applyData = localStorage.getItem("applyData");
    if (applyData) {
      setCourse(JSON.parse(applyData));
    }
  }, [user, authLoading, courseSlug, router]);

  const method = paymentMethods.find((m) => m.id === selectedMethod)!;

  const handleFile = (f: File) => {
    if (f.type.startsWith("image/")) setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !course) {
      setError("Missing required information. Please try again.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Upload the screenshot file
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload screenshot");
      }
      const screenshotUrl = uploadData.url;

      // Step 2: Submit the application with the real screenshot URL
      const applicationData = {
        course_id: course.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        education: "",
        experience: "",
        motivation: note || "",
        amount: course.price || 0,
        payment_method: selectedMethod,
        payment_screenshot: screenshotUrl,
      };
      
      const appResponse = await applicationsAPI.create(applicationData);
      
      if (!appResponse.success) {
        throw new Error(appResponse.error || "Failed to submit application");
      }
      
      setSubmitted(true);
      localStorage.removeItem("applyData");
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-10 max-w-md w-full text-center ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className={`text-2xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Payment Uploaded!</h2>
          <p className={`text-sm mb-3 leading-relaxed ${isDark ? "text-white/70" : "text-gray-600"}`}>
            Your payment screenshot has been submitted successfully.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-yellow-500/10 text-yellow-600 border border-yellow-500/30">
            <AlertCircle className="w-4 h-4" />
            Status: Pending Approval
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? "text-white/50" : "text-gray-500"}`}>
            Our team will verify your payment within 24 hours. You will receive an email notification once approved.
          </p>
          
          <Link 
            href="/academy"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f47822] text-white font-semibold hover:bg-[#e06b18] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <p className={`mt-4 text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>
            Application ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark && <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#f47822]/5 rounded-full blur-[120px]" />}
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-10" : "opacity-5"}`} />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f47822]/20 text-[#f47822] border border-[#f47822]/30 mb-4">
            <CreditCard className="w-3.5 h-3.5" />
            Payment Verification
          </span>
          <h1 className={`text-3xl sm:text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Complete Your Enrollment</h1>
          <p className={isDark ? "text-white/50" : "text-gray-500"}>
            Pay using your preferred method and upload the payment confirmation screenshot.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment method selector */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? "text-white/70" : "text-gray-600"}`}>Select Payment Method</h3>
            {paymentMethods.map((pm) => {
              const Icon = pm.icon;
              const isSelected = selectedMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setSelectedMethod(pm.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? isDark 
                        ? "bg-[#f47822]/5 border-[#f47822]/40" 
                        : "bg-orange-50 border-[#f47822]/30"
                      : isDark
                        ? "bg-white/5 border-transparent hover:border-white/20"
                        : "bg-white border-transparent hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: pm.color + "15", border: `1px solid ${pm.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: pm.color }} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{pm.name}</div>
                    <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{pm.account}</div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 ml-auto flex-shrink-0 text-[#f47822]" />
                  )}
                </button>
              );
            })}

            {/* Instructions */}
            <div className={`rounded-xl p-4 mt-4 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-sm"}`}>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-white/60" : "text-gray-500"}`}>Instructions</h4>
              <ol className="space-y-2 text-xs">
                {[
                  "Pay to the account above",
                  "Take a screenshot of confirmation",
                  "Note your transaction ID",
                  "Upload screenshot below",
                  "Submit for verification"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#f47822]/10 flex items-center justify-center text-[10px] font-bold text-[#f47822] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className={isDark ? "text-white/60" : "text-gray-600"}>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Upload form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className={`rounded-2xl p-6 space-y-5 ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-lg"}`}>
              {/* File upload */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`}>Payment Screenshot *</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                    dragOver
                      ? "border-[#f47822]/60 bg-[#f47822]/5"
                      : file
                        ? "border-green-500/40 bg-green-500/5"
                        : isDark
                          ? "border-white/20 hover:border-white/30"
                          : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <p className="text-sm font-medium text-green-600">{file.name}</p>
                      <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                        <Upload className={`w-6 h-6 ${isDark ? "text-white/30" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
                          Drop screenshot here or <span className="text-[#f47822] font-medium">browse</span>
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-400"}`}>PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>Transaction ID <span className="text-xs opacity-50">(optional)</span></label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. TXN123456789 (optional)"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 transition-colors ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Note */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any additional information..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#f47822]/50 transition-colors resize-none ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Security Badge */}
              <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <Shield className="w-4 h-4 text-[#f47822]" />
                <span className={`text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  Your payment details are encrypted and secure
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Verification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function PaymentClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#f47822] animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
