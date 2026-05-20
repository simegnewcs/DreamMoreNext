import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import { Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificates | LMS",
  description: "View your earned certificates.",
};

export default function CertificatesPage() {
  return (
    <LMSLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificates</h1>
          <p className="text-gray-600">Your achievements and accomplishments</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            You don&apos;t have any certificates yet.
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Complete your courses and pass the final assessments to earn your certificates. 
            Keep learning and you&apos;ll unlock achievements soon!
          </p>
          <a 
            href="/lms/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f47822] text-white rounded-xl font-medium hover:bg-[#e06b18] transition-colors"
          >
            Continue Learning
          </a>
        </div>
      </div>
    </LMSLayout>
  );
}
