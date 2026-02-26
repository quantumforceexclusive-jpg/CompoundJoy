"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    Target,
    Bell,
    Shield,
    LineChart,
    PartyPopper,
} from "lucide-react";

const features = [
    {
        icon: LineChart,
        title: "Visual Compound Calculator",
        description:
            "See exactly how your $20/week turns into thousands. Interactive previews make the math fun, not boring.",
        gradient: "from-joy-500 to-teal-500",
    },
    {
        icon: Target,
        title: "Goal Tracking Dashboard",
        description:
            "Beautiful progress bars, milestone celebrations, and clear timelines for every dream you're saving toward.",
        gradient: "from-coral-500 to-coral-400",
    },
    {
        icon: Bell,
        title: "Friendly Reminders",
        description:
            "Gentle nudges to keep your streak going. Not annoying — motivating. Like a friend cheering you on.",
        gradient: "from-teal-500 to-joy-500",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description:
            "Your financial data stays yours. Enterprise-grade security powered by Convex keeps everything safe.",
        gradient: "from-joy-600 to-joy-400",
    },
    {
        icon: TrendingUp,
        title: "Smart Growth Projections",
        description:
            "See future projections based on your saving pace. Know exactly when you'll hit each goal.",
        gradient: "from-coral-400 to-teal-500",
    },
    {
        icon: PartyPopper,
        title: "Celebration Moments",
        description:
            "Confetti when you hit milestones! 🎉 Because saving money should feel like winning, not suffering.",
        gradient: "from-teal-400 to-coral-500",
    },
];

export function FeaturesSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="py-24 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span
                        className={`inline-block text-sm font-semibold text-coral-500 uppercase tracking-wider mb-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Everything You Need
                    </span>
                    <h2
                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        Features That Make Saving{" "}
                        <span className="text-gradient-warm">Joyful</span>
                    </h2>
                    <p
                        className={`text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        We built every feature to make saving feel exciting, not like a chore.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className={`group hover-lift border-0 shadow-md hover:shadow-xl bg-card transition-all duration-700 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                        >
                            <CardHeader>
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
