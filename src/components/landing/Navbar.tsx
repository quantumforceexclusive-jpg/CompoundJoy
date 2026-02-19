"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass shadow-lg py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-joy flex items-center justify-center shadow-lg shadow-joy-500/30 group-hover:shadow-xl group-hover:shadow-joy-500/40 transition-all duration-300">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold font-[family-name:var(--font-outfit)]">
                        Compound<span className="text-gradient">Joy</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        How It Works
                    </a>
                    <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </a>
                    <a href="#calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Calculator
                    </a>
                    <div className="flex items-center gap-3">
                        <Link href="/sign-in">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button variant="joy" size="sm">Start Free</Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-4 shadow-xl animate-grow">
                    <div className="flex flex-col gap-3">
                        <a href="#how-it-works" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                            How It Works
                        </a>
                        <a href="#features" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                            Features
                        </a>
                        <a href="#calculator" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                            Calculator
                        </a>
                        <hr className="border-border" />
                        <Link href="/sign-in" className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                            Sign In
                        </Link>
                        <Link href="/sign-up">
                            <Button variant="joy" className="w-full">Start Free</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
