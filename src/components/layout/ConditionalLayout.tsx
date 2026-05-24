"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLMSPage = pathname?.startsWith("/lms");
  const isAdminPage = pathname?.startsWith("/admin");
  const isInstructorPage = pathname?.startsWith("/instructor");
  const hideLayout = isLMSPage || isAdminPage || isInstructorPage;

  return (
    <div className={isLMSPage ? "bg-[#f8f9fa]" : ""}>
      {!hideLayout && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
      <ChatbotWidget />
    </div>
  );
}
