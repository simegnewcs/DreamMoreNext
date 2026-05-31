import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentClient from "@/components/payment/PaymentClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Payment Verification",
  description: "Upload your payment screenshot for course enrollment verification.",
};

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <PaymentClient />
    </Suspense>
  );
}
