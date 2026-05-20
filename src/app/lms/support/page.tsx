import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Help & Support | LMS",
  description: "Get help and support for your learning journey.",
};

export default function SupportPage() {
  return (
    <LMSLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">We&apos;re here to help you succeed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Support Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-[#f47822]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-500 text-sm mb-4">
              Have a question or issue? Our support team is ready to assist you.
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:support@dreammore.com" 
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#f47822] transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@dreammore.com
              </a>
              <a 
                href="tel:+251911234567" 
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#f47822] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +251 911 234 567
              </a>
            </div>
          </div>

          {/* FAQ Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
            <p className="text-gray-500 text-sm mb-4">
              Find answers to common questions about our platform.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">• How do I reset my password?</p>
              <p className="text-gray-600">• How long do I have course access?</p>
              <p className="text-gray-600">• Can I download course materials?</p>
            </div>
          </div>
        </div>

        {/* Live Chat Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#f47822] to-[#ff6b35] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Need immediate help?</h3>
              <p className="text-white/80 text-sm">Our support team is available Monday-Friday, 9AM-6PM</p>
            </div>
            <button className="px-5 py-2.5 bg-white text-[#f47822] rounded-xl font-medium hover:bg-gray-100 transition-colors">
              Start Live Chat
            </button>
          </div>
        </div>
      </div>
    </LMSLayout>
  );
}
