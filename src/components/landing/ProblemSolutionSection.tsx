"use client";

import { useEffect, useRef, useState } from "react";
import { Frown, Smile, ArrowRight } from "lucide-react";

export function ProblemSolutionSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2
                            className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                        >
                            From <span className="text-coral-500">&ldquo;I Can&apos;t Afford It&rdquo;</span> to{" "}
                            <span className="text-gradient">&ldquo;I Can&apos;t Wait!&rdquo;</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                        {/* Problem */}
                        <div
                            className={`relative rounded-3xl p-8 lg:p-10 border-2 border-coral-200 bg-gradient-to-br from-coral-50 to-white dark:from-coral-950/20 dark:to-background dark:border-coral-900/30 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                                }`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center mb-6">
                                <Frown className="w-7 h-7 text-coral-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-coral-700 dark:text-coral-400">The Struggle Is Real</h3>
                            <ul className="space-y-4">
                                {[
                                    "You want that new iPhone, but your budget says \"maybe next year\"",
                                    "Dream vacations feel forever out of reach on a normal income",
                                    "Saving feels boring, slow, and honestly... kinda painful",
                                    "Traditional investing feels complicated and intimidating",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-coral-400 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Solution */}
                        <div
                            className={`relative rounded-3xl p-8 lg:p-10 border-2 border-joy-200 bg-gradient-to-br from-joy-50 to-white dark:from-joy-950/20 dark:to-background dark:border-joy-900/30 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                }`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-joy-100 dark:bg-joy-900/30 flex items-center justify-center mb-6">
                                <Smile className="w-7 h-7 text-joy-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-joy-700 dark:text-joy-400">The CompoundJoy Way</h3>
                            <ul className="space-y-4">
                                {[
                                    "Set fun, specific goals — not vague \"savings accounts\"",
                                    "Watch small weekly amounts grow through compound interest",
                                    "Visual progress tracking makes saving genuinely exciting",
                                    "No finance jargon — just your goals, your pace, your joy",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-joy-400 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Arrow connector */}
                    <div
                        className={`flex items-center justify-center mt-10 transition-all duration-700 delay-600 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                            }`}
                    >
                        <div className="flex items-center gap-3 px-6 py-3 rounded-full glass">
                            <span className="text-sm font-medium text-muted-foreground">Small change</span>
                            <ArrowRight className="w-5 h-5 text-joy-500" />
                            <span className="text-sm font-medium text-gradient">Big moments</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
