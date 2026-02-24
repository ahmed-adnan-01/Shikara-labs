import BenefitsSection from "@/Components/BenefitsSection";
import ContactSection from "@/Components/ContactSection";
import Hero from "@/Components/Hero";
import NeedSection from "@/Components/NeedSection";
import ObjectivesSection from "@/Components/ObjectivesSection";

export default function Home() {
  return (
    <div className="relative bg-black">
      <Hero />
      <NeedSection/>
      <ObjectivesSection />
      <BenefitsSection />
      <ContactSection/>
      
      {/* Very visible separator before footer */}
      <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-100" style={{
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)'
      }}></div>
      
      {/* Extra spacing to ensure footer is clearly separated */}
      <div className="w-full h-8 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
    </div>
  );
}
