import HeroSection from "@/components/sections/HeroSection";
import IntroduceSection from "@/components/sections/IntroduceSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectSection from "@/components/sections/ProjectSection";

export default function Home() {
  return (
    <main className="relative bg-white w-full text-black z-20">
      <HeroSection />
      <IntroduceSection/>
      <AboutSection />
      <ProjectSection />
    </main>
  );
}
