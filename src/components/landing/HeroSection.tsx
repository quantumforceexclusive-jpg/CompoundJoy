"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Plane, Smartphone, Music, Sparkles } from "lucide-react";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = Date.now();
                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    animate();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

function FloatingIcon({ icon: Icon, className, delay }: { icon: React.ElementType; className: string; delay: string }) {
    return (
        <div
            className={`absolute p-3 rounded-2xl glass shadow-xl animate-float ${className}`}
            style={{ animationDelay: delay }}
        >
            <Icon className="w-6 h-6" />
        </div>
    );
}

export function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-joy-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-coral-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-400/5 rounded-full blur-3xl" />
            </div>

            {/* Floating icons */}
            <FloatingIcon icon={Plane} className="top-32 right-[15%] text-coral-500 hidden lg:block" delay="0s" />
            <FloatingIcon icon={Smartphone} className="top-48 left-[10%] text-joy-500 hidden lg:block" delay="0.5s" />
            <FloatingIcon icon={Music} className="bottom-32 right-[20%] text-teal-500 hidden lg:block" delay="1s" />
            <FloatingIcon icon={TrendingUp} className="bottom-48 left-[15%] text-coral-400 hidden lg:block" delay="1.5s" />

            <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        <Sparkles className="w-4 h-4 text-coral-500" />
                        <span>The joyful way to save for what you love</span>
                    </div>

                    {/* Main headline */}
                    <h1
                        className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 font-[family-name:var(--font-outfit)] transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        Grow Small Savings
                        <br />
                        <span className="text-gradient">Into Big Moments</span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        Turn <span className="font-semibold text-foreground">$10–50/week</span> into dream vacations, the latest smartphone, concert tickets,
                        and all the experiences you deserve — powered by{" "}
                        <span className="font-semibold text-foreground">compound growth</span>.
                    </p>

                    {/* CTAs */}
                    <div
                        className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        <Link href="/sign-up">
                            <Button variant="joy" size="xl" className="gap-2 group">
                                Start Saving Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/sign-in">
                            <Button variant="outline" size="xl">
                                Sign In
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div
                        className={`grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-gradient">
                                $<AnimatedCounter target={2847} />
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Avg. saved/year</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-gradient">
                                <AnimatedCounter target={12} />k+
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Happy savers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-gradient">
                                <AnimatedCounter target={94} />%
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Hit their goals</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path
                        d="M0 120L48 108C96 96 192 72 288 60C384 48 480 48 576 54C672 60 768 72 864 78C960 84 1056 84 1152 78C1248 72 1344 60 1392 54L1440 48V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    );
}
