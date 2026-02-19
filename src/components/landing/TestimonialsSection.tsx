"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Sarah K.",
        role: "Teacher, 28",
        content:
            "I saved for my dream Paris trip in 22 months! Seeing the compound growth chart was genuinely addicting (in a good way). Landed at CDG last April. 🗼",
        stars: 5,
        goal: "Paris Vacation — $3,200",
        avatar: "SK",
        color: "bg-coral-500",
    },
    {
        name: "Marcus J.",
        role: "Software Developer, 31",
        content:
            "Used CompoundJoy to save for the iPhone 15 Pro Max. Hit my goal 3 weeks early! Now saving for a Japan trip. The progress bars are *chef's kiss*.",
        stars: 5,
        goal: "iPhone 15 Pro Max — $1,199",
        avatar: "MJ",
        color: "bg-joy-500",
    },
    {
        name: "Priya M.",
        role: "Nurse, 26",
        content:
            "I never thought saving could feel exciting. $25/week doesn't feel like much, but watching it compound into my concert bucket list fund? Incredible.",
        stars: 5,
        goal: "Concert Fund — $1,800",
        avatar: "PM",
        color: "bg-teal-500",
    },
    {
        name: "David & Lin T.",
        role: "Couple, 29 & 30",
        content:
            "We're saving for our wedding with CompoundJoy. We both add $50/week and the projections show we'll hit our $15k goal 6 months before the big day!",
        stars: 5,
        goal: "Wedding Fund — $15,000",
        avatar: "DL",
        color: "bg-coral-400",
    },
];

export function TestimonialsSection() {
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
        <section ref={sectionRef} className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-joy-400/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-coral-400/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span
                        className={`inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Real People, Real Goals
                    </span>
                    <h2
                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        They Started Small.{" "}
                        <span className="text-gradient">They Lived Big.</span>
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`group relative rounded-2xl bg-card border p-6 hover-lift transition-all duration-700 ${isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                        >
                            <Quote className="w-8 h-8 text-muted-foreground/20 mb-4" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-3">
                                {Array.from({ length: testimonial.stars }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            {/* Goal badge */}
                            <div className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-medium mb-4">
                                🎯 {testimonial.goal}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t">
                                <div
                                    className={`w-10 h-10 rounded-full ${testimonial.color} text-white flex items-center justify-center text-sm font-bold`}
                                >
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
