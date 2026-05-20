import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "DreamMore admin management panel.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
