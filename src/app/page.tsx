import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSolutionSection } from "@/components/landing/ProblemSolutionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
    return (
        <main>
            <Navbar />
            <HeroSection />
            <ProblemSolutionSection />
            <HowItWorksSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CalculatorSection />
            <FinalCTASection />
            <Footer />
        </main>
    );
}
