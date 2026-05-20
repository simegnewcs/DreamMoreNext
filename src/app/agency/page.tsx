import type { Metadata } from "next";
import AgencyHero from "@/components/agency/AgencyHero";
import AgencyServices from "@/components/agency/AgencyServices";
import AgencyPortfolio from "@/components/agency/AgencyPortfolio";
import AgencyTestimonials from "@/components/agency/AgencyTestimonials";
import AgencyCta from "@/components/agency/AgencyCta";

export const metadata: Metadata = {
  title: "Agency",
  description:
    "DreamMore Digital Agency — Software development, mobile apps, AI solutions, UI/UX design, branding, and more. Building world-class digital products for businesses.",
};

export default function AgencyPage() {
  return (
    <>
      <AgencyHero />
      <AgencyServices />
      <AgencyPortfolio />
      <AgencyTestimonials />
      <AgencyCta />
    </>
  );
}
