import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with DreamMore. Start a project, join the academy, or ask us anything.",
};

export default function ContactPage() {
  return <ContactClient />;
}
