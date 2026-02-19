"use client";

import { useEffect, useRef, useState } from "react";
import { UserPlus, Target, Wallet, TrendingUp } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Sign Up in 30 Seconds",
        description: "Create your free account with just an email. No credit card, no commitments, no stress.",
        color: "text-joy-500",
        bgColor: "bg-joy-100 dark:bg-joy-900/30",
        borderColor: "border-joy-200 dark:border-joy-800",
    },
    {
        icon: Target,
        title: "Set Fun, Specific Goals",
        description: "New iPhone 16? Trip to Japan? Wedding fund? Name your goal, set the amount, and make it real.",
        color: "text-coral-500",
        bgColor: "bg-coral-100 dark:bg-coral-900/30",
        borderColor: "border-coral-200 dark:border-coral-800",
    },
    {
        icon: Wallet,
        title: "Add Money Your Way",
        description: "Contribute weekly or monthly — whatever fits your life. Even $10/week adds up fast.",
        color: "text-teal-500",
        bgColor: "bg-teal-100 dark:bg-teal-900/30",
        borderColor: "border-teal-200 dark:border-teal-800",
    },
    {
        icon: TrendingUp,
        title: "Watch It Grow",
        description: "See compound interest work its magic with beautiful charts and progress celebrations. 🎉",
        color: "text-joy-600",
        bgColor: "bg-joy-100 dark:bg-joy-900/30",
        borderColor: "border-joy-200 dark:border-joy-800",
    },
];

export function HowItWorksSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 bg-muted/30 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span
                        className={`inline-block text-sm font-semibold text-joy-600 dark:text-joy-400 uppercase tracking-wider mb-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Simple as 1-2-3-4
                    </span>
                    <h2
                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        How <span className="text-gradient">CompoundJoy</span> Works
                    </h2>
                    <p
                        className={`text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        No complicated financial plans. Just pick what you want, save a little, and let compound growth do its thing.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative group transition-all duration-700 ${isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                        >
                            {/* Step number */}
                            <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full bg-gradient-joy text-white flex items-center justify-center text-sm font-bold z-10 shadow-lg shadow-joy-500/30">
                                {index + 1}
                            </div>

                            {/* Card */}
                            <div className={`h-full rounded-2xl border ${step.borderColor} bg-card p-6 pt-8 hover-lift`}>
                                <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center mb-4`}>
                                    <step.icon className={`w-6 h-6 ${step.color}`} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>

                            {/* Connector line (hidden on last item and mobile) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-border to-transparent" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
