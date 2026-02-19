"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTASection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-joy-950 via-teal-950 to-joy-950" />
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-64 h-64 bg-joy-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-coral-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div
                    className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white/80 mb-8">
                        <Sparkles className="w-4 h-4 text-coral-400" />
                        Join 12,000+ happy savers
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white mb-6 leading-tight">
                        Ready to Turn Small Habits
                        <br />
                        Into <span className="text-gradient-warm">Big Joys?</span>
                    </h2>

                    <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
                        Start with as little as $5/week. No credit card required.
                        Watch your money grow toward the things that make life amazing.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sign-up">
                            <Button
                                size="xl"
                                className="gap-2 group bg-white text-joy-900 hover:bg-white/90 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                            >
                                Get Started — It&apos;s Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#calculator">
                            <Button
                                variant="outline"
                                size="xl"
                                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                            >
                                Try the Calculator
                            </Button>
                        </Link>
                    </div>

                    <p className="text-sm text-white/40 mt-8">
                        Free forever for personal use. No hidden fees. No BS.
                    </p>
                </div>
            </div>
        </section>
    );
}
