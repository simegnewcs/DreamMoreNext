import HeroSection from "@/components/home/HeroSection";
import AgencyPillar from "@/components/home/AgencyPillar";
import AcademyPillar from "@/components/home/AcademyPillar";
import WhyUs from "@/components/home/WhyUs";
import TeamPreview from "@/components/home/TeamPreview";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AgencyPillar />
      <AcademyPillar />
      <WhyUs />
      <TeamPreview />
      <Testimonials />
    </>
  );
}
